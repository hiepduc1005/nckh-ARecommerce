package com.ecommerce.vn.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.security.JwtGenerator;
import com.ecommerce.vn.service.EmailService;
import com.ecommerce.vn.service.role.RoleService;
import com.ecommerce.vn.service.user.UserAuthProviderService;
import com.ecommerce.vn.service.user.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

@RestController
@RequestMapping("/api/v1/oauth2")
public class OAuth2Controller {
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private RoleService roleService;
	
	@Autowired
	private UserAuthProviderService userAuthProviderService;

    private final ClientRegistrationRepository clientRegistrationRepository;

    public OAuth2Controller(ClientRegistrationRepository clientRegistrationRepository) {
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    private static final JsonFactory JSON_FACTORY = 
            GsonFactory.getDefaultInstance();
    
    @PostMapping("/google/token")
    public ResponseEntity<?> authenticateWithGoogleIdToken(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("id_token");
        ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId("google");
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                .Builder(new NetHttpTransport(), JSON_FACTORY )
                .setAudience(Collections.singletonList(clientRegistration.getClientId()))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String providerUserId = payload.getSubject();

                User user;
                try {
                    user = userService.findUserByEmail(email);
                    user.setUserName(name);
                    userService.updateUser(user);
                    
                    try {
                        String username = user.getUserName() != null ? user.getUserName() : "";
        				emailService.sendLinkAccountEmail(user.getEmail(),username, "google");
        			} catch (IOException e) {
        						
        			}
                } catch (Exception e) {
                	Role userRole = roleService.getRoleByName("USER");
                    user = new User();
                    user.setActive(true);
                    user.setEmail(email);
                    user.setUserName(name);
                    user.setLoyaltyPoint(0);
                    user.setRoles(Arrays.asList(userRole));
                    
                    Cart cart = new Cart();
        			cart.setUser(user);
        			user.setCart(cart);
        			
                    userService.createUser(user);
                    
                    emailService.sendWelcomeEmail(email,name);
                }
                
                userAuthProviderService.linkProviderToUser(user,"google", providerUserId);

                String token = jwtGenerator.gennerateToken(email);

                return ResponseEntity.ok(Map.of(
                        "email", email,
                        "accessToken", token,
                        "tokenType", "Bearer"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
            }
        } catch (GeneralSecurityException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Token verification failed");
        }
    }
    
    
    @PostMapping("/facebook/token")
    public ResponseEntity<?> authenticateWithFacebookToken(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");

        String facebookApiUrl = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(facebookApiUrl, Map.class);
            Map<String, Object> userData = response.getBody();

            String email = (String) userData.get("email");
            String name = (String) userData.get("name");
            String userProviderId = (String) userData.get("id");

            User user;
            try {
                user = userService.findUserByEmail(email);
                user.setUserName(name);
                userService.updateUser(user);
                
                try {
                    String username = user.getUserName() != null ? user.getUserName() : "";
    				emailService.sendLinkAccountEmail(user.getEmail(),username, "facebook");
    			} catch (IOException e) {
    						
    			}
                
            } catch (Exception e) {
            	Role userRole = roleService.getRoleByName("USER");
                user = new User();
                user.setEmail(email);
                user.setUserName(name);
                user.setActive(true);
                user.setLoyaltyPoint(0);
                
                user.setRoles(Arrays.asList(userRole));
                
                Cart cart = new Cart();
    			cart.setUser(user);
    			user.setCart(cart);
                
                userService.createUser(user);
                
                emailService.sendWelcomeEmail(email,name);
                
            }

            userAuthProviderService.linkProviderToUser(user,"facebook", userProviderId);
           
            String jwt = jwtGenerator.gennerateToken(email);

            return ResponseEntity.ok(Map.of(
                "accessToken", jwt,
                "tokenType", "Bearer",
                "email", email
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Facebook access token");
        }
    }

    
    
}

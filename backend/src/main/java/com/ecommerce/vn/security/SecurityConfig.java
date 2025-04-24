package com.ecommerce.vn.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableJpaAuditing
@EnableScheduling
public class SecurityConfig {
	
	@Autowired
	public CustomUserDetailService customUserDetailService;
	
	@Autowired
	public PasswordConfig passwordConfig;
	

//	@Bean
//	public CustomUserDetailService getCustomUserDetailService() {
//		return customUserDetailService;
//	}

	public void setCustomUserDetailService(CustomUserDetailService customUserDetailService) {
		this.customUserDetailService = customUserDetailService;
	}
	
	@Bean
	public JwtFilterChain jwtFilterChain() {
		return new JwtFilterChain();
	}

	
	
	@Bean
	public DaoAuthenticationProvider daoAuthenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(customUserDetailService);
		provider.setPasswordEncoder(passwordConfig.passwordEncoder());
		return provider;
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Cho phép React
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
//				.authorizeHttpRequests(request -> 
//					request.requestMatchers("/api/v1/public/**","/api/v1/auth/**").permitAll()
//						   .requestMatchers("/api/admin/**").hasRole("ADMIN")
//						   .requestMatchers("/api/products/**").permitAll()
//						   .anyRequest().authenticated()
//						   )
				.authorizeHttpRequests(request -> 
				request
					   .anyRequest().permitAll()
					   )
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(daoAuthenticationProvider());
		
		http.addFilterBefore(jwtFilterChain(), UsernamePasswordAuthenticationFilter.class);

		http.oauth2Client(Customizer.withDefaults());

		
		return http.build();
	}
	
//	@Bean
//	public WebMvcConfigurer corsConfigurer() {
//		return new WebMvcConfigurer() {
//			@Override
//			public void addCorsMappings(@NonNull CorsRegistry registry) {
//				registry.addMapping("/**")
//						.allowedMethods("*")
//						.allowCredentials(true)
//						.allowedOriginPatterns("*");
//			}
//		};
//	}
}

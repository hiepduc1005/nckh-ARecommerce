package com.ecommerce.vn.service.user;

import java.util.List;
import java.util.Optional;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAuthProvider;

public interface UserAuthProviderService {
    UserAuthProvider save(User user, String provider, String providerUserId);
    Optional<UserAuthProvider> findByProviderAndProviderUserId(String provider, String providerUserId);
    List<UserAuthProvider> findAllByUser(User user);
    boolean existsByUserAndProvider(User user, String provider);
    void linkProviderToUser(User user, String provider, String providerUserId);
    void unlinkProvider(User user, String provider);
}

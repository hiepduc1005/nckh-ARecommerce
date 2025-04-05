package com.ecommerce.vn.service.user.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAuthProvider;
import com.ecommerce.vn.repository.UserAuthProviderRepository;
import com.ecommerce.vn.service.user.UserAuthProviderService;

import jakarta.transaction.Transactional;

@Service
public class UserAuthProviderServiceImpl implements UserAuthProviderService {

    @Autowired
    private  UserAuthProviderRepository authProviderRepository;


    @Override
    @Transactional
    public UserAuthProvider save(User user, String provider, String providerUserId) {
        UserAuthProvider authProvider = new UserAuthProvider();
        authProvider.setUser(user);
        authProvider.setProvider(provider);
        authProvider.setProviderUserId(providerUserId);
        return authProviderRepository.save(authProvider);
    }

    @Override
    @Transactional
    public Optional<UserAuthProvider> findByProviderAndProviderUserId(String provider, String providerUserId) {
//        return authProviderRepository.findByProviderAndProviderUserId(provider, providerUserId);
    	return null;
    }

    @Override
    @Transactional
    public List<UserAuthProvider> findAllByUser(User user) {
//        return authProviderRepository.findAllByUser(user);
    	return null;

    }

    @Override
    @Transactional
    public boolean existsByUserAndProvider(User user, String provider) {
        return authProviderRepository.existsByUserAndProvider(user, provider);
    }

    @Override
    @Transactional
    public void linkProviderToUser(User user, String provider, String providerUserId) {
        if (!existsByUserAndProvider(user, provider)) {
            save(user, provider, providerUserId);
          
        }
    }

    @Override
    @Transactional
    public void unlinkProvider(User user, String provider) {
//        authProviderRepository.deleteByUserAndProvider(user, provider);
    	
    }
}

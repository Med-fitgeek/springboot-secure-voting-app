package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.service.interfaces.TokenGenerationService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TokenGenerationServiceImpl implements TokenGenerationService {

    private static final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generateToken() {

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

}

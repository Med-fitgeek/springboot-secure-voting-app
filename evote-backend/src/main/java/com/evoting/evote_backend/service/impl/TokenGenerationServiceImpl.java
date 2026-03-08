package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.service.interfaces.TokenGenerationService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TokenGenerationServiceImpl implements TokenGenerationService {

    @Override
    public UUID generateToken() {
        return UUID.randomUUID();
    }

}

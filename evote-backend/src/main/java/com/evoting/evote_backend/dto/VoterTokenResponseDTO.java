package com.evoting.evote_backend.dto;
import java.util.UUID;

public record VoterTokenResponseDTO(
        String voterEmail,
        UUID token
) {}

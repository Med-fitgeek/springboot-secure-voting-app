package com.evoting.evote_backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record VoteRequestDTO(

        @NotNull(message = "Voting token is required")
        UUID token,

        @NotNull(message = "Option id is required")
        Long optionId

) {}
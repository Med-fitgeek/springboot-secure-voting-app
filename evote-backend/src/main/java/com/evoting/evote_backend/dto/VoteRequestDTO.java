package com.evoting.evote_backend.dto;

import jakarta.validation.constraints.NotNull;

public record VoteRequestDTO(

        @NotNull(message = "Voting token is required")
        String token,

        @NotNull(message = "Option id is required")
        Long optionId

) {}
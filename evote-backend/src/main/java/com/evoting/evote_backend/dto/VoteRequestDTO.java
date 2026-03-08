package com.evoting.evote_backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record VoteRequestDTO(
        @NotNull
        UUID token,
        @NotNull
        Long optionId) {}

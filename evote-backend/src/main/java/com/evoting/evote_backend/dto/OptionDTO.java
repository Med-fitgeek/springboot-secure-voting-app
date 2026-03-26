package com.evoting.evote_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record OptionDTO(
        Long id,
        @NotBlank
        String label){ }


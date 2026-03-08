package com.evoting.evote_backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.List;

public record ElectionRequestDTO(
        @NotBlank
        String title,
        @NotBlank
        String description,
        @NotEmpty
        List<String> options,
        @NotEmpty
        LocalDateTime startDate,
        @NotEmpty
        LocalDateTime endDate,
        @NotEmpty
        List<VoterDTO> voters) { }


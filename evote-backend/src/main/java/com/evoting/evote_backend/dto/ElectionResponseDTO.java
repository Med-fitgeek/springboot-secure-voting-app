package com.evoting.evote_backend.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Builder
public record ElectionResponseDTO(
        Long id,
        String title,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        List<OptionDTO> options) {}

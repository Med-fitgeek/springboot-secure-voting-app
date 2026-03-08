package com.evoting.evote_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record VotePageDTO(
        Long electionId,
        String title,
        String description,
        LocalDateTime endDate,
        List<OptionDTO> options
) {}
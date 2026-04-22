package com.evoting.evote_backend.dto;

import java.time.LocalDateTime;

public record UpdateUserDto(
        String username,
        String email,
        LocalDateTime updatedAt
) {}

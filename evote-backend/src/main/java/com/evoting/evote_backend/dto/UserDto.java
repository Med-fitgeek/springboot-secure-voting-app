package com.evoting.evote_backend.dto;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String username,
        String email,
        LocalDateTime createdAt) {}

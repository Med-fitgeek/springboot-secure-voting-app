package com.evoting.evote_backend.dto;

public record UpdatePasswordDto(
        String currentPassword,
        String newPassword
) {}
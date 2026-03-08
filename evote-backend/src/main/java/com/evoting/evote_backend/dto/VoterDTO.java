package com.evoting.evote_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VoterDTO(

        @NotBlank(message = "Voter name is required")
        @Size(max = 150, message = "Name too long")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 255)
        String email

) {}
package com.evoting.evote_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

public record VoterTokenResponseDTO(String voter, UUID token){ }


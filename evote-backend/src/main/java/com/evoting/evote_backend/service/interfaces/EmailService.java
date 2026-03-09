package com.evoting.evote_backend.service.interfaces;

import com.evoting.evote_backend.dto.VoterTokenResponseDTO;
import com.evoting.evote_backend.entity.VoterToken;

import java.util.List;

public interface EmailService {
    void sendVotingLinks(List<VoterTokenResponseDTO> tokens);
}

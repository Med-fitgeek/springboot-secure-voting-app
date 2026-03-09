package com.evoting.evote_backend.service.interfaces;

import com.evoting.evote_backend.dto.VotePageDTO;
import com.evoting.evote_backend.dto.VoteRequestDTO;
import com.evoting.evote_backend.dto.VoterDTO;
import com.evoting.evote_backend.dto.VoterTokenResponseDTO;
import com.evoting.evote_backend.entity.Election;
import com.evoting.evote_backend.entity.VoterToken;

import java.util.List;
import java.util.UUID;

public interface VoterTokenService {
    void vote(VoteRequestDTO request);
    List<VoterTokenResponseDTO> generateTokens(
            Election election,
            List<VoterDTO> voters
    );
    VotePageDTO getElectionForVote(String token);
}

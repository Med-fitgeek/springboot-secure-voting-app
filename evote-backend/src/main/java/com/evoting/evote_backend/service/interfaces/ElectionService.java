package com.evoting.evote_backend.service.interfaces;

import com.evoting.evote_backend.dto.ElectionRequestDTO;
import com.evoting.evote_backend.dto.ElectionResponseDTO;
import com.evoting.evote_backend.dto.ElectionResultDTO;
import com.evoting.evote_backend.dto.VoterTokenResponseDTO;

import java.util.List;

public interface ElectionService {
    List<VoterTokenResponseDTO> createElection(ElectionRequestDTO dto, String username);
    String updateElection(Long id, ElectionRequestDTO dto, String username);
    void deleteElection(Long id, String username);
    ElectionResponseDTO getElectionById(Long id, String username);
    List<ElectionResponseDTO> getElectionsByCreator(String username);
    List<ElectionResultDTO> getElectionResults(Long electionId, String username);

}

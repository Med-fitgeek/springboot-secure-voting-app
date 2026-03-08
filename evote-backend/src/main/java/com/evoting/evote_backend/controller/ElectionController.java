package com.evoting.evote_backend.controller;

import com.evoting.evote_backend.dto.*;
import com.evoting.evote_backend.entity.User;
import com.evoting.evote_backend.service.interfaces.CsvImportService;
import com.evoting.evote_backend.service.interfaces.ElectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;
    private final CsvImportService csvImportService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')") // ou 'ELECTION_CREATOR' selon ton enum
    public ResponseEntity<List<VoterTokenResponseDTO>> createElection(
            MultipartFile file,
            @RequestBody @Valid ElectionRequestDTO request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        String username = user.getUsername(); // extrait depuis le token JWT
        List<VoterTokenResponseDTO> tokens = electionService.createElection(request, username);
        return ResponseEntity.ok(tokens);
    }


    @GetMapping("/results/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ElectionResultDTO>> getResults(@PathVariable Long id) {
        return ResponseEntity.ok(electionService.getElectionResults(id));
    }

    @GetMapping("/election/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ElectionResponseDTO> getElection(@PathVariable Long id, Authentication authentication ) {
        User user = (User) authentication.getPrincipal();
        String username = user.getUsername();
        return ResponseEntity.ok(electionService.getElectionById(id, username));
    }

    @GetMapping("/elections")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ElectionResponseDTO>> getElections(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String username = user.getUsername();
        return ResponseEntity.ok(electionService.getElectionsByCreator(username));
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> updateElection(
            @PathVariable Long id,
            @RequestBody ElectionRequestDTO dto,
            Authentication authentication
    ){
        String username = authentication.getName();
        electionService.updateElection(id, dto, username);
        return ResponseEntity.ok("Election mis  jour");
    }

    @PostMapping("/upload-voters")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VoterDTO>> uploadVoters(
            @RequestParam("file") MultipartFile file
    ) {

        List<VoterDTO> voters = csvImportService.parseVotersCsv(file);

        return ResponseEntity.ok(voters);
    }
}

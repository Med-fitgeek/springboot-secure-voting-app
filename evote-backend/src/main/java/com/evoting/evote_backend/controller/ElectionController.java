package com.evoting.evote_backend.controller;

import com.evoting.evote_backend.dto.*;
import com.evoting.evote_backend.entity.User;
import com.evoting.evote_backend.service.interfaces.CsvImportService;
import com.evoting.evote_backend.service.interfaces.ElectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")

public class ElectionController {

    private final ElectionService electionService;
    private final CsvImportService csvImportService;

    @PostMapping
    public ResponseEntity<List<VoterTokenResponseDTO>> createElection(
            @Valid @RequestBody ElectionRequestDTO request,
            @AuthenticationPrincipal User user
            ) {

        String username = user.getUsername();
        List<VoterTokenResponseDTO> elections = electionService.createElection(request, username);

        return ResponseEntity.status(HttpStatus.CREATED).body(elections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponseDTO> getElection(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {

        String username = user.getUsername();

        ElectionResponseDTO response = electionService.getElectionById(id, username);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ElectionResponseDTO>> getElections(
            @AuthenticationPrincipal User user
    ) {

        String username = user.getUsername();

        List<ElectionResponseDTO> response = electionService.getElectionsByCreator(username);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateElection(
            @PathVariable Long id,
            @RequestBody @Valid ElectionRequestDTO dto,
            @AuthenticationPrincipal User user
    ){

        String username = user.getUsername();

        electionService.updateElection(id, dto, username);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Election updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElection(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {

        String username = user.getUsername();

        electionService.deleteElection(id, username);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<List<ElectionResultDTO>> getResults(
            @PathVariable Long id,
            @AuthenticationPrincipal User user

    ) {

        String username = user.getUsername();

        return ResponseEntity.ok(
                electionService.getElectionResults(id, username)
        );
    }

    @PostMapping("/upload-voters")
    public ResponseEntity<List<VoterDTO>> uploadVoters(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {

        String username = user.getUsername();

        return ResponseEntity.ok(
                csvImportService.parseVotersCsv(file, username)
        );
    }
}
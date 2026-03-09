package com.evoting.evote_backend.controller;

import com.evoting.evote_backend.dto.VotePageDTO;
import com.evoting.evote_backend.dto.VoteRequestDTO;
import com.evoting.evote_backend.service.interfaces.VoterTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/vote")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class VoteController {

    private final VoterTokenService voterTokenService;

    @PostMapping
    public ResponseEntity<String> vote(@Valid @RequestBody VoteRequestDTO request) {

        voterTokenService.vote(request);

        return ResponseEntity.ok("Vote recorded successfully");
    }

    @GetMapping("/{token}")
    public ResponseEntity<VotePageDTO> getElectionForVote(
            @PathVariable String token
    ) {

        return ResponseEntity.ok(
                voterTokenService.getElectionForVote(token)
        );
    }
}

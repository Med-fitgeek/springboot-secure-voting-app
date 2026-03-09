package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.*;
import com.evoting.evote_backend.entity.Election;
import com.evoting.evote_backend.entity.Option;
import com.evoting.evote_backend.entity.VoterToken;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.repository.OptionRepository;
import com.evoting.evote_backend.repository.VoterTokenRepository;
import com.evoting.evote_backend.service.interfaces.TokenGenerationService;
import com.evoting.evote_backend.service.interfaces.TokenHashService;
import com.evoting.evote_backend.service.interfaces.VoterTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoterTokenServiceImpl implements VoterTokenService {

    private final VoterTokenRepository voterTokenRepository;
    private final OptionRepository optionRepository;
    private final TokenGenerationService tokenGenerationService;
    private final TokenHashService tokenHashService;

    @Transactional
    @Override
    public void vote(VoteRequestDTO request) {

        VoterToken voterToken = voterTokenRepository
                .findByTokenHash(tokenHashService.hashToken(request.token()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (voterToken.isUsed()) {
            throw new IllegalStateException("Token already used");
        }

        Election election = voterToken.getElection();
        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(election.getStartDate())
                || now.isAfter(election.getEndDate())) {

            throw new IllegalStateException("Voting period not active");
        }

        Option option = optionRepository
                .findById(request.optionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid option"));

        if (!option.getElection().getId().equals(election.getId())) {
            throw new IllegalArgumentException("Option not in this election");
        }

        voterToken.setSelectedOption(option);
        voterToken.setUsed(true);
        voterToken.setVotedAt(LocalDateTime.now());

        voterTokenRepository.save(voterToken);
    }

    @Transactional
    @Override
    public List<VoterTokenResponseDTO> generateTokens(
            Election election,
            List<VoterDTO> voters
    ) {

        List<VoterToken> tokensToSave = new ArrayList<>();
        List<VoterTokenResponseDTO> response = new ArrayList<>();

        for ( VoterDTO voter : voters ) {

            String rawToken = tokenGenerationService.generateToken();
            String tokenHash = tokenHashService.hashToken(rawToken);

            VoterToken voterToken = VoterToken.builder()
                    .email(voter.email())
                    .name(voter.name())
                    .tokenHash(tokenHash)
                    .used(false)
                    .election(election)
                    .build();

            tokensToSave.add(voterToken);

            response.add(new VoterTokenResponseDTO(
                    voter.email(),
                    rawToken
            ));
        }

        voterTokenRepository.saveAll(tokensToSave);
        return response;
    }

    @Override
    public VotePageDTO getElectionForVote(String token) {

        VoterToken voterToken = voterTokenRepository
                .findByTokenHash(tokenHashService.hashToken(token))
                .orElseThrow(() -> new BusinessException("Invalid voting token"));

        if (voterToken.isUsed()) {
            throw new BusinessException("This voting link has already been used");
        }

        Election election = voterToken.getElection();

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(election.getStartDate())) {
            throw new BusinessException("Voting has not started yet");
        }

        if (now.isAfter(election.getEndDate())) {
            throw new BusinessException("Voting period has ended");
        }

        List<OptionDTO> options = election.getOptions()
                .stream()
                .map(o -> new OptionDTO(o.getId(), o.getLabel()))
                .toList();

        return new VotePageDTO(
                election.getId(),
                election.getTitle(),
                election.getDescription(),
                election.getEndDate(),
                options
        );
    }
}


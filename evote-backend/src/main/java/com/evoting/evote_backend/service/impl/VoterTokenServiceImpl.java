package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.OptionDTO;
import com.evoting.evote_backend.dto.VotePageDTO;
import com.evoting.evote_backend.dto.VoteRequestDTO;
import com.evoting.evote_backend.dto.VoterDTO;
import com.evoting.evote_backend.entity.Election;
import com.evoting.evote_backend.entity.Option;
import com.evoting.evote_backend.entity.VoterToken;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.repository.OptionRepository;
import com.evoting.evote_backend.repository.VoterTokenRepository;
import com.evoting.evote_backend.service.interfaces.VoterTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoterTokenServiceImpl implements VoterTokenService {

    private final VoterTokenRepository voterTokenRepository;
    private final OptionRepository optionRepository;

    @Transactional
    @Override
    public void vote(VoteRequestDTO request) {

        VoterToken voterToken = voterTokenRepository
                .findByToken(request.token())
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
    public List<VoterToken> generateTokens(
            Election election,
            List<VoterDTO> voters
    ) {

        List<VoterToken> tokens = voters.stream()
                .map(voter -> VoterToken.builder()
                        .email(voter.email())
                        .name(voter.name())
                        .token(UUID.randomUUID())
                        .used(false)
                        .election(election)
                        .build()
                )
                .toList();

        return voterTokenRepository.saveAll(tokens);
    }

    @Override
    public VotePageDTO getElectionForVote(UUID token) {

        VoterToken voterToken = voterTokenRepository
                .findByToken(token)
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


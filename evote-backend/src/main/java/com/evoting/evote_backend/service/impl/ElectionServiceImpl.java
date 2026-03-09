package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.*;
import com.evoting.evote_backend.entity.*;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.mapper.ElectionMapper;
import com.evoting.evote_backend.repository.*;
import com.evoting.evote_backend.service.interfaces.ElectionService;
import com.evoting.evote_backend.service.interfaces.EmailService;
import com.evoting.evote_backend.service.interfaces.TokenHashService;
import com.evoting.evote_backend.service.interfaces.VoterTokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ElectionServiceImpl implements ElectionService {

    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final VoterTokenRepository voterTokenRepository;
    private final OptionRepository optionRepository;
    private final ElectionMapper electionMapper;
    private final VoterTokenService voterTokenService;
    private final EmailService emailService;
    private final TokenHashService tokenHashService;


    @Transactional
    @Override
    public List<VoterTokenResponseDTO> createElection(
            ElectionRequestDTO dto,
            String username
    ) {

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        validateElectionDates(dto);

        Election election = electionMapper.toEntity(dto);
        election.setCreatedBy(creator);

        electionRepository.save(election);

        List<VoterTokenResponseDTO> tokensDto = voterTokenService.generateTokens(
                election,
                dto.voters()
        );

        emailService.sendVotingLinks(tokensDto);

        return tokensDto;
    }

    @Override
    @Transactional
    public String updateElection(Long id, ElectionRequestDTO dto, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Élection introuvable"));

        if (!election.getCreatedBy().getId().equals(creator.getId()))
            throw new BusinessException("Vous n’êtes pas autorisé à modifier cette élection.");

        if (election.getStartDate().isBefore(LocalDateTime.now()))
            throw new BusinessException("Impossible de modifier une élection déjà commencée.");

        election.setTitle(dto.title());
        election.setDescription(dto.description());
        election.setStartDate(dto.startDate());
        election.setEndDate(dto.endDate());

        List<Option> newOptions = new ArrayList<>();
        for (String label : dto.options()) {
            Option option = Option.builder()
                    .label(label)
                    .election(election)
                    .build();
            newOptions.add(option);
        }
        election.setOptions(newOptions);


        List<VoterToken> newVoters = new ArrayList<>();
        for (VoterDTO name : dto.voters()) {
            VoterToken token = VoterToken.builder()
                    .tokenHash(UUID.randomUUID().toString())
                    .used(false)
                    .election(election)
                    .build();
            newVoters.add(token);
        }
        election.setVoterTokens(newVoters);

        electionRepository.save(election);
        return "Élection mise à jour avec succès.";
    }

    @Override
    @Transactional
    public void deleteElection(Long id, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Élection introuvable"));

        if (!election.getCreatedBy().getId().equals(creator.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à supprimer cette élection.");
        }

        if (election.getStartDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Impossible de supprimer une élection déjà commencée.");
        }

        electionRepository.delete(election);
    }

    @Override
    public ElectionResponseDTO getElectionById(Long id, String username) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Élection introuvable"));

        if (!election.getCreatedBy().getUsername().equals(username)) {
            throw new BusinessException("Accès interdit à cette élection.");
        }

        return electionMapper.toDto(election);
    }

    @Override
    public List<ElectionResponseDTO> getElectionsByCreator(String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        List<Election> elections = electionRepository.findByCreatedBy(creator);
        return electionMapper.toDtoList(elections);
    }

    @Override
    public List<ElectionResultDTO> getElectionResults(Long electionId, String username) {

        userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new BusinessException("Élection introuvable"));

        List<Option> options = optionRepository.findByElection(election);

        return options.stream()
                .map(option -> new ElectionResultDTO(
                        option.getId(),
                        option.getLabel(),
                        voterTokenRepository.countBySelectedOption(option)
                ))
                .toList();
    }


    private void validateElectionDates(ElectionRequestDTO dto) {

        if (dto.startDate().isAfter(dto.endDate()))
            throw new IllegalArgumentException("Start date must be before end date");

        if (dto.startDate().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Start date must be in the future");
    }

}

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

        Election election = Election.builder()
                .title(dto.title())
                .description(dto.description())
                .createdBy(creator)
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .build();

        for (OptionDTO optionDto : dto.options()) {
            Option option = Option.builder()
                    .label(optionDto.label())
                    .election(election)
                    .build();
            election.getOptions().add(option);
        }

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
                .orElseThrow(() -> new BusinessException("User not found"));

        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Election not found"));

        if (!election.getCreatedBy().getId().equals(creator.getId()))
            throw new BusinessException("User not allowed to update election");

        if (election.getStartDate().isBefore(LocalDateTime.now()))
            throw new BusinessException("Impossible to update election before start date.");

        election.setTitle(dto.title());
        election.setDescription(dto.description());
        election.setStartDate(dto.startDate());
        election.setEndDate(dto.endDate());

        List<Option> newOptions = new ArrayList<>();
        for (OptionDTO optionDTO : dto.options()) {
            Option option = Option.builder()
                    .label(optionDTO.label())
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
        return "Election successfully updated";
    }

    @Override
    @Transactional
    public void deleteElection(Long id, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Election not found"));

        if (!election.getCreatedBy().getId().equals(creator.getId())) {
            throw new BusinessException("User not allowed to delete election");
        }

        if (election.getStartDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Impossible to delete election after start date.");
        }

        electionRepository.delete(election);
    }

    @Override
    public ElectionResponseDTO getElectionById(Long id, String username) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Election not found"));

        if (!election.getCreatedBy().getUsername().equals(username)) {
            throw new BusinessException("Acces not allowed to retrieve election");
        }

        return electionMapper.toDto(election);
    }

    @Override
    public List<ElectionResponseDTO> getElectionsByCreator(String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        List<Election> elections = electionRepository.findByCreatedBy(creator);
        return elections.stream().map(election -> {

            long voterCount = voterTokenRepository.countByElectionId(election.getId());
            long votesCast = voterTokenRepository.countByElectionIdAndUsedTrue(election.getId());

            ElectionResponseDTO dto = electionMapper.toDto(election);

            return ElectionResponseDTO.builder()
                    .id(dto.id())
                    .title(dto.title())
                    .description(dto.description())
                    .startDate(dto.startDate())
                    .endDate(dto.endDate())
                    .options(dto.options())
                    .voterCount(voterCount)
                    .votesCast(votesCast)
                    .build();

        }).toList();
    }

    @Override
    public List<ElectionResultDTO> getElectionResults(Long electionId, String username) {

        userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new BusinessException("Election not found"));

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

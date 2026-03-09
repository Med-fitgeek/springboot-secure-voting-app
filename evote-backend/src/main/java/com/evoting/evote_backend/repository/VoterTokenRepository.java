package com.evoting.evote_backend.repository;

import com.evoting.evote_backend.entity.Option;
import com.evoting.evote_backend.entity.VoterToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;
import java.util.UUID;

public interface VoterTokenRepository extends JpaRepository<VoterToken, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<VoterToken> findByTokenHash(String tokenHash);
    long countBySelectedOption(Option option);
}

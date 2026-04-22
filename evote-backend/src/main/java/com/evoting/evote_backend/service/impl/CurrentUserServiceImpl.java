package com.evoting.evote_backend.service.impl;

import com.evoting.evote_backend.dto.UpdatePasswordDto;
import com.evoting.evote_backend.dto.UpdateUserDto;
import com.evoting.evote_backend.dto.UserDto;
import com.evoting.evote_backend.entity.User;
import com.evoting.evote_backend.exception.BusinessException;
import com.evoting.evote_backend.repository.UserRepository;
import com.evoting.evote_backend.service.interfaces.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //------------------------------------------------------
    // Get current authenticated user
    //------------------------------------------------------

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("User not authenticated");
        }

        return userRepository.findByEmailAndDeletedFalse(authentication.getName())
                .orElseThrow(() -> new BusinessException("User not found"));
    }

    //------------------------------------------------------
    // Update profile (username, email, avatarId)
    //------------------------------------------------------

    @Override
    public UserDto UpdateUser(UpdateUserDto dto) {
        User user = getCurrentUser();

        user.setUsername(dto.username());
        user.setEmail(dto.email());
        userRepository.save(user);

        return toDto(user);
    }

    //------------------------------------------------------
    // Update password
    //------------------------------------------------------

    @Override
    public void updatePassword(UpdatePasswordDto dto) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }

        if (dto.newPassword() == null || dto.newPassword().length() < 8) {
            throw new BusinessException("New password must be at least 8 characters");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    //------------------------------------------------------
    // Soft delete account
    //------------------------------------------------------

    @Override
    public void deleteAccount() {
        User user = getCurrentUser();
        user.setDeleted(true);
        userRepository.save(user);
    }

    //------------------------------------------------------
    // Helper
    //------------------------------------------------------

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
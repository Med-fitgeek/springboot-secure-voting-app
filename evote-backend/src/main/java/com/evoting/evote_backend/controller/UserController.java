package com.evoting.evote_backend.controller;

import com.evoting.evote_backend.dto.UpdatePasswordDto;
import com.evoting.evote_backend.dto.UpdateUserDto;
import com.evoting.evote_backend.dto.UserDto;
import com.evoting.evote_backend.entity.User;
import com.evoting.evote_backend.service.interfaces.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = currentUserService.getCurrentUser();
        return ResponseEntity.ok(new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateUser(@RequestBody UpdateUserDto dto) {
        return ResponseEntity.ok(currentUserService.UpdateUser(dto));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> updatePassword(@RequestBody UpdatePasswordDto dto) {
        currentUserService.updatePassword(dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount() {
        currentUserService.deleteAccount();
        return ResponseEntity.noContent().build();
    }
}
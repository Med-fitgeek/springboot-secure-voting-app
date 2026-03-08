package com.evoting.evote_backend.controller;

import com.evoting.evote_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> req) {
        String token = authService.register(req.get("username"), req.get("email"), req.get("password"));

        return ResponseEntity.status(HttpStatus.CREATED).body(token);
    }

    @PostMapping("/login")
        public ResponseEntity<String> login(@RequestBody Map<String, String> req) {
        String token = authService.authenticate(req.get("username"), req.get("password"));

        return ResponseEntity.ok(token);
    }
}

package com.danielfreitassc.backend.controlles;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.AuthenticationDto;
import com.danielfreitassc.backend.dtos.LoginResponseDto;
import com.danielfreitassc.backend.services.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/login")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping
    public LoginResponseDto login(@RequestBody @Valid AuthenticationDto authenticationDto) {
        return authenticationService.login(authenticationDto);
    }
}
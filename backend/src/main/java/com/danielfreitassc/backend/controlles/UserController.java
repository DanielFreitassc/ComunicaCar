package com.danielfreitassc.backend.controlles;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.configurations.OnCreate;
import com.danielfreitassc.backend.dtos.InfoResponseDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.dtos.UserRequestDto;
import com.danielfreitassc.backend.dtos.UserResponseDto;
import com.danielfreitassc.backend.models.UserEntity;
import com.danielfreitassc.backend.models.UserRole;
import com.danielfreitassc.backend.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponseDto create(@RequestBody @Validated(OnCreate.class) UserRequestDto userRequestDto) {
        return userService.create(userRequestDto);
    }
    
    @GetMapping
    public Page<UserResponseDto> getUser(Pageable pageable) {
        return userService.getUsers(pageable);
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    @GetMapping("/info")
    public InfoResponseDto userInfo(@AuthenticationPrincipal UserEntity userEntity) {
       String name = userEntity.getName();
       UserRole role = userEntity.getRole();
       return new InfoResponseDto(name,role);
    }

    @PatchMapping("/{id}")
    public MessageResponseDto patchUser(@PathVariable UUID id, @RequestBody @Valid UserRequestDto userDTO) {
        return userService.patchUser(id, userDTO);
    }

    @DeleteMapping("/{id}")
    private MessageResponseDto deleteUser(@PathVariable UUID id) {
        return userService.deleteUser(id);
    }
}

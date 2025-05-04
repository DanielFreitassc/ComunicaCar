package com.danielfreitassc.backend.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.dtos.UserRequestDto;
import com.danielfreitassc.backend.dtos.UserResponseDto;
import com.danielfreitassc.backend.mappers.UserMapper;
import com.danielfreitassc.backend.models.UserEntity;
import com.danielfreitassc.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    public MessageResponseDto create(UserRequestDto userRequestDto) {
        Optional<UserEntity> existingUser = userRepository.findByUsername(userRequestDto.username());
        if (existingUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário já cadastrado.");
        }
        UserEntity userEntity = userMapper.toEntity(userRequestDto);

        String encryptedPassword = new BCryptPasswordEncoder().encode(userRequestDto.password());
        userEntity.setPassword(encryptedPassword);
        userRepository.save(userEntity);    

        return new MessageResponseDto("Usuário criado com sucesso.");
    }

    public Page<UserResponseDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    public UserResponseDto getById(UUID id) {
        return userMapper.toDto(checkUserId(id));
    }

    public boolean existsByEmail(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public MessageResponseDto patchUser(UUID id, UserRequestDto userRequestDto) {
        UserEntity userEntity = checkUserId(id);
        
        if (userRequestDto.name() != null && !userRequestDto.name().isBlank()) {
            userEntity.setName(userRequestDto.name());
        }

        if (userRequestDto.username() != null && !userRequestDto.username().isBlank()) {
            userEntity.setUsername(userRequestDto.username());
        }

        if (userRequestDto.role() != null) {
            userEntity.setRole(userRequestDto.role());
        }

        if (userRequestDto.password() != null && !userRequestDto.password().isBlank()) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(userRequestDto.password());
            userEntity.setPassword(encryptedPassword);
        }
        
        userRepository.save(userEntity);
        return new MessageResponseDto("Usuário atualizado com sucesso.");
    }

    private UserEntity checkUserId(UUID id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if(user.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Nenhum usuário com este ID cadastrado.");
        return user.get();
    }
}

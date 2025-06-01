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
import com.danielfreitassc.backend.models.UserRole;
import com.danielfreitassc.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    public MessageResponseDto create(UserRequestDto userRequestDto) {
        nameExists(userRequestDto.username(), null);
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
            nameExists(userRequestDto.username(), id);
            userEntity.setUsername(userRequestDto.username());
        }

        if (userRequestDto.role() != null) {
            if (userEntity.getRole() == UserRole.ADMIN && userRequestDto.role() != UserRole.ADMIN) {
                long adminCount = userRepository.countByRole(UserRole.ADMIN);
                
                if (adminCount == 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Não é possível alterar a role do único admin restante.");
            }
            userEntity.setRole(userRequestDto.role());
        }

        if (userRequestDto.password() != null && !userRequestDto.password().isBlank()) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(userRequestDto.password());
            userEntity.setPassword(encryptedPassword);
        }
        
        userRepository.save(userEntity);
        return new MessageResponseDto("Usuário atualizado com sucesso.");
    }

    public MessageResponseDto deleteUser(UUID id) {
        UserEntity userEntity = checkUserId(id);
    
        if(userEntity.getRole() == UserRole.ADMIN) countAdmin(UserRole.ADMIN);

        userRepository.delete(userEntity);
        return new MessageResponseDto("Usuário removido com sucesso.");
    }

    private void nameExists(String username, UUID currentId) {
        Optional<UserEntity> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent() && (currentId == null || !existingUser.get().getId().equals(currentId))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário já cadastrado.");
        }
    }

    private void countAdmin(UserRole role) {
        long adminCount = userRepository.countByRole(role);
        if(adminCount == 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Não é possível remover o único admin restante");
    }

    private UserEntity checkUserId(UUID id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if(user.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Nenhum usuário com este ID cadastrado.");
        return user.get();
    }
}

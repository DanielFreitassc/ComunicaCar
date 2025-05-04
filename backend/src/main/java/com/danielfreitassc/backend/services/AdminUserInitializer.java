package com.danielfreitassc.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.models.UserEntity;
import com.danielfreitassc.backend.models.UserRole;
import com.danielfreitassc.backend.repositories.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final UserService userService;
    @Value("${spring.datasource.username}")
    private String adminUsername;

    @Value("${spring.datasource.password}")
    private String adminPassword;

    @PostConstruct
    public void init() {
        if (!userService.existsByEmail(adminUsername)) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(adminPassword);

            //Conta admin
            UserEntity admin = new UserEntity();
            admin.setName("Administrador");
            admin.setUsername(adminUsername);
            admin.setPassword(encryptedPassword);
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);

            // Conta secretario
            UserEntity secretario = new UserEntity();
            secretario.setName("secretario");
            secretario.setUsername("ciclano");
            secretario.setPassword(encryptedPassword);
            secretario.setRole(UserRole.EMPLOYEE_SECRETARY);
            userRepository.save(secretario);
       

            // Conta mecanico
            UserEntity mecanico = new UserEntity();
            mecanico.setName("mecanico");
            mecanico.setUsername("fulano");
            mecanico.setPassword(encryptedPassword);
            mecanico.setRole(UserRole.EMPLOYEE_MECHANIC);
            userRepository.save(mecanico);
            
            System.out.println("Admin user created.");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
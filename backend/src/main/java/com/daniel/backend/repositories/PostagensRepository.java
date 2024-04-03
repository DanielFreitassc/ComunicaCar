package com.daniel.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daniel.backend.models.PostagensEntity;

public interface PostagensRepository extends JpaRepository<PostagensEntity, Long> {
    
}

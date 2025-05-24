package com.danielfreitassc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.MediaEntity;

public interface MediaRepository extends JpaRepository<MediaEntity,String> {
    
}

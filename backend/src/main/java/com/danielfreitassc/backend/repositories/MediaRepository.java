package com.danielfreitassc.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.MediaEntity;

public interface MediaRepository extends JpaRepository<MediaEntity,String> {
    List<MediaEntity> findByStep_Id(String stepId);
}

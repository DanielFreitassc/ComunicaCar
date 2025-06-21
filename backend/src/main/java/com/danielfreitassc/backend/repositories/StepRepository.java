package com.danielfreitassc.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.StepEntity;

public interface StepRepository extends JpaRepository<StepEntity, String> {
    List<StepEntity> findByService_Id(String serviceId);
}

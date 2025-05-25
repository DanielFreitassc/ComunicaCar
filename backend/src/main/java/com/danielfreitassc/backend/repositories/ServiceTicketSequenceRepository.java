package com.danielfreitassc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.ServiceTicketSequenceEntity;

public interface ServiceTicketSequenceRepository extends JpaRepository<ServiceTicketSequenceEntity, String> {
}


package com.danielfreitassc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.ServicesEntity;

public interface ServicesRepository extends JpaRepository<ServicesEntity, String> {
    long countByTicketNumberStartingWith(String prefix);
}

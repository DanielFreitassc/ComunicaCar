package com.danielfreitassc.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.ServicesEntity;

public interface ServicesRepository extends JpaRepository<ServicesEntity, String> {
    long countByTicketNumberStartingWith(String prefix);

    Page<ServicesEntity> findAll(Specification<ServicesEntity> spec, Pageable pageable);
}

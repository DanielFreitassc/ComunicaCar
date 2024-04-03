package com.daniel.backend.repositories;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daniel.backend.models.PostagensEntity;

public interface PostagensRepository extends JpaRepository<PostagensEntity, Long> {
    List<PostagensEntity> findByData(LocalDate data);
    List<PostagensEntity> findByDataBetween(LocalDate startDate, LocalDate endDate);
}

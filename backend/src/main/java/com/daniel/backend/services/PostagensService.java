package com.daniel.backend.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.daniel.backend.dtos.PostagensRecordDTO;
import com.daniel.backend.models.PostagensEntity;
import com.daniel.backend.repositories.PostagensRepository;

@Service
public class PostagensService {
    @Autowired
    private PostagensRepository postagensRepository;

    public ResponseEntity<PostagensEntity> savePostagens(PostagensRecordDTO postagensRecordDTO) {
        PostagensEntity postagensEntity = new PostagensEntity();
        BeanUtils.copyProperties(postagensRecordDTO, postagensEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(postagensRepository.save(postagensEntity));
    }
    
    public ResponseEntity<List<PostagensEntity>> getAllPostagens() {
        List<PostagensEntity> postagens = postagensRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(postagens);
    }
    
    public ResponseEntity<List<PostagensEntity>> getPostagensByDate(int year, int month, int day) {
        LocalDate data = LocalDate.of(year, month, day);
        List<PostagensEntity> postagens = postagensRepository.findByData(data);
        
        if (postagens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(postagens);
    }
    
    public ResponseEntity<List<PostagensEntity>> getPostagensByYearAndMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1); 
        
        List<PostagensEntity> postagens = postagensRepository.findByDataBetween(startDate, endDate);
        
        if (postagens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(postagens);
    }
    
    public ResponseEntity<List<PostagensEntity>> getPostagensByYear(int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31); 
        
        List<PostagensEntity> postagens = postagensRepository.findByDataBetween(startDate, endDate);
        
        if (postagens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        postagens.sort((p1, p2) -> p2.getData().compareTo(p1.getData()));
        
        return ResponseEntity.status(HttpStatus.OK).body(List.of(postagens.get(0)));
    }
    
    public ResponseEntity<List<PostagensEntity>> getPostagensBetweenYears(int startYear, int endYear) {
        LocalDate startDate = LocalDate.of(startYear, 1, 1);
        LocalDate endDate = LocalDate.of(endYear, 12, 31); 
        
        List<PostagensEntity> postagens = postagensRepository.findByDataBetween(startDate, endDate);
        
        if (postagens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(postagens);
    }
}
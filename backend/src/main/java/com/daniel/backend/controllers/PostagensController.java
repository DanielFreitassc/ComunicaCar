package com.daniel.backend.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.backend.dtos.PostagensRecordDTO;
import com.daniel.backend.models.PostagensEntity;
import com.daniel.backend.services.PostagensService;


@RestController
@RequestMapping("postagens")
public class PostagensController {
    @Autowired
    private PostagensService postagensService;

    @PostMapping
    public ResponseEntity<PostagensEntity> savePostagens(@RequestBody PostagensRecordDTO postagensRecordDTO) {
        return postagensService.savePostagens(postagensRecordDTO);
    }

    @GetMapping
    public ResponseEntity<List<PostagensEntity>> getAllPostagens(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) Integer startYear,
            @RequestParam(required = false) Integer endYear
    ) {
        if (year != null && month != null && day != null) {
         
            return postagensService.getPostagensByDate(year, month, day);
        } else if (year != null && month != null) {

            return postagensService.getPostagensByYearAndMonth(year, month);
        } else if (year != null) {

            return postagensService.getPostagensByYear(year);
        } else if (startYear != null && endYear != null) {
      
            return postagensService.getPostagensBetweenYears(startYear, endYear);
        } else {
            
            return postagensService.getAllPostagens();
        }
    }
}

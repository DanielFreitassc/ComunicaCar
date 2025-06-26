package com.danielfreitassc.backend.controlles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.StepRequestDto;
import com.danielfreitassc.backend.dtos.StepResponseDto;
import com.danielfreitassc.backend.services.StepService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/steps")
public class StepController {
    private final StepService stepService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StepResponseDto create(@RequestBody @Valid StepRequestDto stepRequestDto) {
        return stepService.create(stepRequestDto);
    }

    @GetMapping
    public Page<StepResponseDto> getPages(Pageable pageable) {
        return stepService.getPages(pageable);
    }

    @GetMapping("/{id}")
    public StepResponseDto getStep(@PathVariable String id) {
        return stepService.getStep(id);
    }

    @PutMapping("/{id}")
    public StepResponseDto update(@PathVariable String id,@RequestBody @Valid StepRequestDto stepRequestDto) {
        return stepService.update(id, stepRequestDto);
    }

    @DeleteMapping("/{id}")
    public StepResponseDto delete(@PathVariable String id) throws Exception {
        return stepService.delete(id);
    }
}

package com.danielfreitassc.backend.services;

import com.danielfreitassc.backend.models.ServicesEntity;
import com.danielfreitassc.backend.models.StatusEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ServicesSpecifications {

    public static Specification<ServicesEntity> filterByStatusAndMechanicId(StatusEnum status, UUID mechanicId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (mechanicId != null) {
                predicates.add(criteriaBuilder.equal(root.get("mechanicId").get("id"), mechanicId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
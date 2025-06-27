package com.danielfreitassc.backend.models;

import java.sql.Timestamp;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "services")
@Entity(name = "services")
public class ServicesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String ticketNumber;
    private String title;
    private String clientName;
    private String vehicle;
    private String description;
    private String contactNumber;

    @ManyToOne
    @JoinColumn(name = "mechanic_id")
    private UserEntity mechanicId;

    private LocalDate conclusionDate; 

    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    @CreationTimestamp
    private Timestamp createdAt;
}

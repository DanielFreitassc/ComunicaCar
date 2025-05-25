package com.danielfreitassc.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "service_ticket_sequence")
@Table(name = "service_ticket_sequence")
public class ServiceTicketSequenceEntity {
    @Id
    @Column(name = "year_key")
    private String yearKey;

    @Column(nullable = false)
    private int lastNumber;
}


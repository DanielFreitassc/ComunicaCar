-- Tabela 'users'
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    login_attempts INT DEFAULT 0,
    lockout_expiration TIMESTAMP
);

-- Índice para melhorar performance de busca por username
CREATE INDEX idx_users_username ON users(username);

-- Tabela 'services'
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE,
    title VARCHAR(255) NOT NULL,
    vehicle VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_number VARCHAR(9) NOT NULL,
    mechanic_id UUID NOT NULL,
    conclusion_date DATE NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_services_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id)
);

-- Tabela 'media'
CREATE TABLE media (
    id VARCHAR(36) PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL,
    image_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_media_service FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tabela de controle de sequência por ano para número de tickets
CREATE TABLE service_ticket_sequence (
    year_key VARCHAR(4) PRIMARY KEY,
    last_number INT NOT NULL
);

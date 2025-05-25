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

-- Create an index on the email column for faster lookups
CREATE INDEX idx_users_username ON users(username);

-- Create 'services' table
CREATE TABLE services (
    id UUID PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE,
    title VARCHAR(255) NOT NULL,
    vehicle VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_number VARCHAR(9) NOT NULL,
    mechanic_id UUID NOT NULL,
    conclusion_date DATE NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(id)
);

-- Create 'media' table
CREATE TABLE media (
    id UUID PRIMARY KEY,
    service_id UUID NOT NULL,
    image_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id)
);


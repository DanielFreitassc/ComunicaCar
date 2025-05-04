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
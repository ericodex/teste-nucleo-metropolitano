CREATE TABLE usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email do usuário',
    senha VARCHAR(255) NOT NULL COMMENT 'Senha criptografada com BCrypt',
    cpf VARCHAR(11) NOT NULL UNIQUE COMMENT 'CPF sem pontuação (apenas números)',
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_role ON usuario(role);

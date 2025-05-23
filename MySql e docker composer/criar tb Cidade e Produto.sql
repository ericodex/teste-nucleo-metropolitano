CREATE TABLE cidade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    estado CHAR(2) COMMENT 'Sigla do estado (ex: SP, RJ)',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cidade_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produto (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT COMMENT 'Descrição detalhada do produto',
    valor DECIMAL(10,2) NOT NULL COMMENT 'Valor com 2 casas decimais',
    estoque INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE COMMENT 'Código único do produto',
    cidade_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE COMMENT 'Indica se o produto está ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cidade_id) REFERENCES cidade(id) ON DELETE RESTRICT,
    INDEX idx_produto_nome (nome),
    INDEX idx_produto_valor (valor),
    INDEX idx_produto_cidade (cidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


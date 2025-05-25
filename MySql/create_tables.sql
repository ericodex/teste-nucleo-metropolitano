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

INSERT INTO nm_gestao_de_produtos.cidade
(id, nome, estado, data_criacao, data_atualizacao)
VALUES(1, 'Uberlândia', 'MG', '2025-05-23 09:00:13', '2025-05-23 09:00:13');

INSERT INTO nm_gestao_de_produtos.cidade
(id, nome, estado, data_criacao, data_atualizacao)
VALUES(2, 'Patos de Minas', 'MG', '2025-05-23 09:00:13', '2025-05-23 09:00:13');

# Script para popular a tabela produto e testar paginação
INSERT INTO nm_gestao_de_produtos.produto
(id, nome, descricao, valor, estoque, sku, cidade_id, ativo, data_criacao, data_atualizacao)
VALUES
(2, 'Chá Verde Orgânico', 'Chá verde de folhas selecionadas, antioxidante', 18.50, 80, 'CHA-VERDE-002', 2, 1, '2025-05-24 21:15:00', '2025-05-24 21:15:00'),
(3, 'Chocolate Amargo 70%', 'Chocolate intenso com alto teor de cacau', 32.00, 60, 'CHC-AMRG-003', 1, 1, '2025-05-24 21:16:00', '2025-05-24 21:16:00'),
(4, 'Azeite Extra Virgem', 'Azeite premium da primeira prensagem a frio', 45.90, 75, 'AZE-EXVR-004', 2, 1, '2025-05-24 21:17:00', '2025-05-24 21:17:00'),
(5, 'Mel Puro Silvestre', 'Mel natural colhido de florada silvestre', 29.99, 120, 'MEL-PURE-005', 1, 1, '2025-05-24 21:18:00', '2025-05-24 21:18:00'),
(6, 'Pão Artesanal Integral', 'Pão de fermentação natural com grãos integrais', 15.00, 40, 'PAO-ARTG-006', 2, 1, '2025-05-24 21:19:00', '2025-05-24 21:19:00'),
(7, 'Geleia de Morango Caseira', 'Geleia feita com morangos frescos e sem conservantes', 22.00, 90, 'GEL-MRNG-007', 1, 1, '2025-05-24 21:20:00', '2025-05-24 21:20:00'),
(8, 'Queijo Minas Frescal', 'Queijo artesanal de Minas Gerais, sabor suave', 38.00, 50, 'QJO-MFRC-008', 2, 1, '2025-05-24 21:21:00', '2025-05-24 21:21:00'),
(9, 'Biscoitos Amanteigados', 'Biscoitos finos com receita tradicional', 19.50, 110, 'BSC-AMTG-009', 1, 1, '2025-05-24 21:22:00', '2025-05-24 21:22:00'),
(10, 'Vinho Tinto Cabernet Sauvignon', 'Vinho encorpado com notas de frutas vermelhas', 75.00, 30, 'VIN-TCSV-010', 2, 1, '2025-05-24 21:23:00', '2025-05-24 21:23:00'),
(11, 'Arroz Basmati Premium', 'Arroz aromático de grãos longos', 28.00, 150, 'ARZ-BSMT-011', 1, 1, '2025-05-24 21:24:00', '2025-05-24 21:24:00'),
(12, 'Quinoa em Grãos', 'Superalimento rico em proteínas e fibras', 35.00, 70, 'QNO-GRNS-012', 2, 1, '2025-05-24 21:25:00', '2025-05-24 21:25:00'),
(13, 'Macarrão Artesanal Sem Glúten', 'Massa italiana sem glúten, feita com farinha de arroz', 26.50, 85, 'MAC-ARTG-013', 1, 1, '2025-05-24 21:26:00', '2025-05-24 21:26:00'),
(14, 'Molho de Tomate Rústico', 'Molho caseiro com tomates frescos e manjericão', 17.00, 95, 'MLH-TOMT-014', 2, 1, '2025-05-24 21:27:00', '2025-05-24 21:27:00'),
(15, 'Cerveja Artesanal IPA', 'Cerveja lupulada com amargor equilibrado', 22.00, 65, 'CRV-ARTG-015', 1, 1, '2025-05-24 21:28:00', '2025-05-24 21:28:00'),
(16, 'Castanha do Pará Selecionada', 'Castanhas frescas e crocantes, ricas em selênio', 55.00, 45, 'CST-PARA-016', 2, 1, '2025-05-24 21:29:00', '2025-05-24 21:29:00'),
(17, 'Frutas Secas Mix', 'Mix de frutas secas e desidratadas para lanches', 30.00, 105, 'FRT-SECM-017', 1, 1, '2025-05-24 21:30:00', '2025-05-24 21:30:00'),
(18, 'Cafeteira Francesa', 'Cafeteira de prensa para um café encorpado', 89.90, 25, 'CAF-FRNC-018', 2, 1, '2025-05-24 21:31:00', '2025-05-24 21:31:00'),
(19, 'Moedor de Café Elétrico', 'Moedor prático para grãos frescos', 120.00, 35, 'MOD-CAFE-019', 1, 1, '2025-05-24 21:32:00', '2025-05-24 21:32:00'),
(20, 'Cesta de Café da Manhã', 'Cesta com itens selecionados para um café especial', 150.00, 15, 'CST-CAFE-020', 2, 1, '2025-05-24 21:33:00', '2025-05-24 21:33:00');
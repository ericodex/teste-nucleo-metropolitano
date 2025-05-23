package com.gestaoprodutos.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "produto", indexes = {
        @Index(name = "idx_produto_nome", columnList = "nome"),
        @Index(name = "idx_produto_valor", columnList = "valor"),
        @Index(name = "idx_produto_cidade", columnList = "cidade_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do produto é obrigatório")
    @Size(max = 100, message = "Nome do produto deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT COMMENT 'Descrição detalhada do produto'")
    private String descricao;

    @NotNull(message = "Valor do produto é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Column(nullable = false, columnDefinition = "DECIMAL(10,2) COMMENT 'Valor com 2 casas decimais'")
    private BigDecimal valor;

    @Min(value = 0, message = "Estoque não pode ser negativo")
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer estoque = 0;

    @Size(max = 50, message = "SKU deve ter no máximo 50 caracteres")
    @Column(unique = true, length = 50, columnDefinition = "VARCHAR(50) COMMENT 'Código único do produto'")
    private String sku;

    @NotNull(message = "Cidade é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cidade_id", nullable = false, foreignKey = @ForeignKey(name = "fk_produto_cidade"))
    private Cidade cidade;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE COMMENT 'Indica se o produto está ativo'")
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime dataAtualizacao;

    // Métodos de negócio
    public void diminuirEstoque(Integer quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser positiva");
        }
        if (this.estoque < quantidade) {
            throw new IllegalStateException("Estoque insuficiente");
        }
        this.estoque -= quantidade;
    }

    public void aumentarEstoque(Integer quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser positiva");
        }
        this.estoque += quantidade;
    }

    // Padrão Builder
    public static ProdutoBuilder builder() {
        return new ProdutoBuilder();
    }

    public static final class ProdutoBuilder {
        private Long id;
        private String nome;
        private String descricao;
        private BigDecimal valor;
        private Integer estoque;
        private String sku;
        private Cidade cidade;
        private Boolean ativo;

        private ProdutoBuilder() {
        }

        public ProdutoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProdutoBuilder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public ProdutoBuilder descricao(String descricao) {
            this.descricao = descricao;
            return this;
        }

        public ProdutoBuilder valor(BigDecimal valor) {
            this.valor = valor;
            return this;
        }

        public ProdutoBuilder estoque(Integer estoque) {
            this.estoque = estoque;
            return this;
        }

        public ProdutoBuilder sku(String sku) {
            this.sku = sku;
            return this;
        }

        public ProdutoBuilder cidade(Cidade cidade) {
            this.cidade = cidade;
            return this;
        }

        public ProdutoBuilder ativo(Boolean ativo) {
            this.ativo = ativo;
            return this;
        }

        public Produto build() {
            Produto produto = new Produto();
            produto.setId(id);
            produto.setNome(nome);
            produto.setDescricao(descricao);
            produto.setValor(valor);
            produto.setEstoque(estoque != null ? estoque : 0);
            produto.setSku(sku);
            produto.setCidade(cidade);
            produto.setAtivo(ativo != null ? ativo : true);
            return produto;
        }
    }
}
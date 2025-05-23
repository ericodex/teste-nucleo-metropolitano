package com.gestaoprodutos.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cidade", indexes = @Index(name = "idx_cidade_nome", columnList = "nome"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Cidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome da cidade é obrigatório")
    @Size(max = 100, message = "Nome da cidade deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nome;

    @Pattern(regexp = "[A-Z]{2}", message = "Estado deve ser uma sigla de 2 letras maiúsculas")
    @Column(columnDefinition = "CHAR(2) COMMENT 'Sigla do estado (ex: SP, RJ)'")
    private String estado;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime dataAtualizacao;

    // Padrão Builder
    public static CidadeBuilder builder() {
        return new CidadeBuilder();
    }

    public static final class CidadeBuilder {
        private Long id;
        private String nome;
        private String estado;

        private CidadeBuilder() {
        }

        public CidadeBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CidadeBuilder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public CidadeBuilder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Cidade build() {
            Cidade cidade = new Cidade();
            cidade.setId(id);
            cidade.setNome(nome);
            cidade.setEstado(estado);
            return cidade;
        }
    }
}
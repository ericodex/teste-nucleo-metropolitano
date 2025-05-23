package com.gestaoprodutos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProdutoDTO {
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Schema(description = "Nome do produto", example = "Café Gourmet")
    private String nome;

    @Schema(description = "Descrição detalhada do produto", example = "Café arábica de torra média")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser positivo")
    @Schema(description = "Valor unitário do produto", example = "35.50")
    private BigDecimal valor;

    @Min(value = 0, message = "Estoque não pode ser negativo")
    @Schema(description = "Quantidade de estoque do produto", example = "50")
    private Integer estoque;

    @NotBlank(message = "SKU é obrigatório")
    @Schema(description = "Código único do produto", example = "CFG-001")
    private String sku;

    @NotNull(message = "Cidade é obrigatória")
    @Schema(description = "ID da cidade associada ao produto", example = "1")
    private Long cidadeId;

    @Schema(description = "Nome da cidade associada ao produto (apenas leitura)", readOnly = true, example = "São Paulo")
    private String nomeCidade; // Novo campo para o nome da cidade

    @Schema(description = "Indica se o produto está ativo", example = "true")
    private Boolean ativo; // Novo campo para o status ativo

    @Schema(description = "Timestamp de criação do produto", readOnly = true, example = "2023-10-26T10:00:00")
    private LocalDateTime dataCriacao; // Novo campo para data de criação

    @Schema(description = "Timestamp da última atualização do produto", readOnly = true, example = "2023-10-26T11:30:00")
    private LocalDateTime dataAtualizacao; // Novo campo para data de atualização

    // Getters e Setters (ajustados para incluir os novos campos)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Long getCidadeId() {
        return cidadeId;
    }

    public void setCidadeId(Long cidadeId) {
        this.cidadeId = cidadeId;
    }

    public String getNomeCidade() { // Getter para nomeCidade
        return nomeCidade;
    }

    public void setNomeCidade(String nomeCidade) { // Setter para nomeCidade
        this.nomeCidade = nomeCidade;
    }

    public Boolean getAtivo() { // Getter para ativo
        return ativo;
    }

    public void setAtivo(Boolean ativo) { // Setter para ativo
        this.ativo = ativo;
    }

    public LocalDateTime getDataCriacao() { // Getter para dataCriacao
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) { // Setter para dataCriacao
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() { // Getter para dataAtualizacao
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { // Setter para dataAtualizacao
        this.dataAtualizacao = dataAtualizacao;
    }
}

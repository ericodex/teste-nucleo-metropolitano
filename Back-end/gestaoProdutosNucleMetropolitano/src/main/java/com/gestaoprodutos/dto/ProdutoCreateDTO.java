package com.gestaoprodutos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO para criação de um novo produto.
 * Não inclui o ID, pois ele é gerado automaticamente pelo banco de dados.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ProdutoCreateRequest", description = "Dados para criar um novo produto")
public class ProdutoCreateDTO {

    @NotBlank(message = "Nome do produto é obrigatório")
    @Size(max = 100, message = "Nome do produto deve ter no máximo 100 caracteres")
    @Schema(description = "Nome do produto", example = "Café Especial Blend")
    private String nome;

    @Schema(description = "Descrição detalhada do produto", example = "Um café com notas frutadas e acidez equilibrada")
    private String descricao;

    @NotNull(message = "Valor do produto é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Digits(integer = 8, fraction = 2, message = "Valor deve ter no máximo 8 dígitos inteiros e 2 decimais")
    @Schema(description = "Valor unitário do produto", example = "25.99")
    private BigDecimal valor;

    @Min(value = 0, message = "Estoque não pode ser negativo")
    @Schema(description = "Quantidade de estoque inicial do produto", example = "100")
    private Integer estoque = 0;

    @Size(max = 50, message = "SKU deve ter no máximo 50 caracteres")
    @Schema(description = "Código único do produto (SKU)", example = "CFE-BLND-001")
    private String sku;

    @NotNull(message = "ID da cidade é obrigatório")
    @Min(value = 1, message = "ID da cidade deve ser maior que zero")
    @Schema(description = "ID da cidade onde o produto está disponível", example = "1")
    private Long cidadeId;
}

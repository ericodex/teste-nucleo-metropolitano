package com.gestaoprodutos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) para a entidade Cidade.
 * Utilizado para representar os dados da cidade nas respostas da API.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "CidadeDTO", description = "Representação dos dados de uma cidade")
public class CidadeDTO {

    @Schema(description = "ID único da cidade", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Nome da cidade é obrigatório")
    @Size(max = 100, message = "Nome da cidade deve ter no máximo 100 caracteres")
    @Schema(description = "Nome da cidade", example = "São Paulo")
    private String nome;

    @Pattern(regexp = "[A-Z]{2}", message = "Estado deve ser uma sigla de 2 letras maiúsculas")
    @Schema(description = "Sigla do estado (ex: SP, RJ)", example = "SP")
    private String estado;

    @Schema(description = "Timestamp de criação da cidade", accessMode = Schema.AccessMode.READ_ONLY, example = "2023-01-15T14:30:00")
    private LocalDateTime dataCriacao;

    @Schema(description = "Timestamp da última atualização da cidade", accessMode = Schema.AccessMode.READ_ONLY, example = "2023-01-15T15:00:00")
    private LocalDateTime dataAtualizacao;
}

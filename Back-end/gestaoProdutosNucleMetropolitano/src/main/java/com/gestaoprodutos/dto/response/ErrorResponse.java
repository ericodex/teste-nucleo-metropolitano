package com.gestaoprodutos.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Estrutura padrão para respostas de erro da API")
public class ErrorResponse {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Timestamp do erro", example = "2023-08-20 14:30:45")
    private LocalDateTime timestamp;

    @Schema(description = "Código HTTP do erro", example = "400")
    private int status;

    @Schema(description = "Tipo do erro", example = "Bad Request")
    private String error;

    @Schema(description = "Mensagem descritiva do erro")
    private String message;

    @Schema(description = "Caminho da requisição que causou o erro", example = "/api/v1/produtos")
    private String path;

    @Schema(description = "Lista de erros de validação (opcional)")
    private List<FieldError> errors;

    @Getter
    @Setter
    @AllArgsConstructor
    @Schema(description = "Detalhes de erro de validação de campos")
    public static class FieldError {
        @Schema(description = "Nome do campo com erro", example = "preco")
        private String field;

        @Schema(description = "Mensagem de erro do campo", example = "O preço deve ser positivo")
        private String message;
    }

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
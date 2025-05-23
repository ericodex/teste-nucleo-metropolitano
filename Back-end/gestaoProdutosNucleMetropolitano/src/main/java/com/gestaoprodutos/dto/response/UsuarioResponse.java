package com.gestaoprodutos.dto.response;

import com.gestaoprodutos.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO de resposta para informações do usuário")
public class UsuarioResponse {

    @Schema(description = "ID do usuário", example = "1")
    private Long id;

    @Schema(description = "Nome completo do usuário", example = "João Silva")
    private String nome;

    @Schema(description = "Email do usuário", example = "joao.silva@email.com")
    private String email;

    @Schema(description = "CPF do usuário (apenas números)", example = "12345678901")
    private String cpf;

    @Schema(description = "Perfil de acesso do usuário", example = "USER")
    private Role role;

    @Schema(description = "Data de criação do usuário", example = "2023-08-15T10:30:00")
    private LocalDateTime dataCriacao;

    @Schema(description = "Data da última atualização do usuário", example = "2023-08-15T10:30:00")
    private LocalDateTime dataAtualizacao;
}
package com.gestaoprodutos.dto;

import com.gestaoprodutos.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "DTO para transferência de dados de usuário")
public class UsuarioDTO {

    @Schema(description = "ID do usuário", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Schema(description = "Nome completo do usuário", example = "João Silva", required = true)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Schema(description = "Email do usuário", example = "joao.silva@email.com", required = true)
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos")
    @Schema(description = "CPF do usuário (apenas números)", example = "12345678901", required = true)
    private String cpf;

    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    @Schema(description = "Senha do usuário (só é necessária na criação)", example = "senhaSegura123", writeOnly = true)
    private String senha;

    @NotNull(message = "Perfil é obrigatório")
    @Schema(description = "Perfil de acesso do usuário", example = "USER", allowableValues = { "USER",
            "ADMIN" }, defaultValue = "USER")
    private Role role;
}
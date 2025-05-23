package com.gestaoprodutos.controller;

import com.gestaoprodutos.dto.request.LoginRequest;
import com.gestaoprodutos.dto.request.RegisterRequest;
import com.gestaoprodutos.dto.response.JwtResponse;
import com.gestaoprodutos.model.entity.Usuario;
import com.gestaoprodutos.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")

@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints para autenticação e registro de usuários")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar novo usuário", description = "Cria uma nova conta de usuário (role USER por padrão)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Long.class))
            }),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou email já cadastrado")
    })
    @PostMapping("/register")
    public ResponseEntity<Long> register(@Valid @RequestBody RegisterRequest request) {
        Long userId = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userId);
    }

    @Operation(summary = "Autenticar usuário", description = "Realiza login e retorna um token JWT válido")
    @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida", content = @Content(schema = @Schema(implementation = JwtResponse.class)))
    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Listar todos os usuários (exige token JWT e role ADMIN)",
               description = "Retorna uma lista de todos os usuários cadastrados. Acesso restrito apenas a usuários com a role ADMIN.")
    @ApiResponse(responseCode = "200", description = "Usuários encontrados", content = @Content(schema = @Schema(implementation = Usuario.class))) // Ajustado para Usuario.class
    @ApiResponse(responseCode = "401", description = "Não autorizado - Token JWT ausente ou inválido")
    @ApiResponse(responseCode = "403", description = "Proibido - Usuário não tem a role ADMIN")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<List<Usuario>> listAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}
package com.gestaoprodutos.controller;

import com.gestaoprodutos.dto.CidadeDTO;
import com.gestaoprodutos.service.CidadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gerenciar operações relacionadas a cidades.
 * Todos os endpoints exigem autenticação JWT.
 */
@RestController
@RequestMapping("/v1/cidades")
@RequiredArgsConstructor
@Tag(name = "Cidades", description = "Operações para gerenciamento de cidades")
@SecurityRequirement(name = "bearerAuth")
public class CidadeController {

    private final CidadeService cidadeService;

    /**
     * Lista todas as cidades.
     * Acesso permitido para usuários com role USER ou ADMIN.
     * 
     * @return Uma lista de CidadeDTOs.
     */
    @Operation(summary = "Listar todas as cidades (disponível para USER e ADMIN)", description = "Retorna uma lista de todas as cidades. Requer autenticação JWT e role USER ou ADMIN.")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<CidadeDTO>> listarTodas() {
        return ResponseEntity.ok(cidadeService.listarTodas());
    }

}

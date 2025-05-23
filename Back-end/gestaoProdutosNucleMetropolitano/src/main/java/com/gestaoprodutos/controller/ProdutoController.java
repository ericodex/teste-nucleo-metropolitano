package com.gestaoprodutos.controller;

import com.gestaoprodutos.dto.ProdutoCreateDTO;
import com.gestaoprodutos.dto.ProdutoDTO;
import com.gestaoprodutos.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/v1/produtos")
@Tag(name = "Produtos", description = "Operações para gerenciamento de produtos")
@SecurityRequirement(name = "bearerAuth")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @Operation(summary = "Listar todos os produtos (disponível para USER e ADMIN)", description = "Retorna uma lista paginada de todos os produtos. Requer autenticação JWT e role USER ou ADMIN.")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<Page<ProdutoDTO>> listarTodos(
            @Parameter(description = "Número da página a ser retornada (inicia em 0).", example = "0") @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Número de itens por página.", example = "10") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Critério de ordenação no formato 'campo,direção' (ex: nome,asc ou valor,desc).", example = "nome,asc") @RequestParam(required = false) String sort) {

        Sort sortObj = Sort.unsorted();
        if (sort != null && !sort.trim().isEmpty()) {
            String[] parts = sort.trim().split(",");
            String property = parts[0].trim();
            Sort.Direction direction = Sort.Direction.ASC;

            if (parts.length > 1) {
                String directionStr = parts[1].trim().toUpperCase();
                try {
                    direction = Sort.Direction.valueOf(directionStr);
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid sort direction '" + directionStr + "' for property '" + property
                            + "'. Defaulting to ASC.");
                }
            }
            sortObj = Sort.by(direction, property);
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return ResponseEntity.ok(produtoService.listarTodos(pageable));
    }

    @Operation(summary = "Buscar produto por ID (disponível para USER e ADMIN)", description = "Retorna um único produto com base no ID fornecido. Requer autenticação JWT e role USER ou ADMIN.")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @Operation(summary = "Criar novo produto (exige role ADMIN)", description = "Cria um novo produto no sistema. Requer autenticação JWT e role ADMIN.")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoDTO> criarProduto(@Valid @RequestBody ProdutoCreateDTO produtoCreateDTO) {
        ProdutoDTO produtoSalvo = produtoService.salvar(produtoCreateDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .buildAndExpand(produtoSalvo.getId())
                .toUri();

        return ResponseEntity.created(location).body(produtoSalvo);
    }

    @Operation(summary = "Atualizar produto (exige role ADMIN)", description = "Atualiza os dados de um produto existente. Requer autenticação JWT e role ADMIN.")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoDTO> atualizarProduto(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoDTO produtoDTO) {
        return ResponseEntity.ok(produtoService.atualizar(id, produtoDTO));
    }

    @Operation(summary = "Excluir produto (exige role ADMIN)", description = "Exclui um produto do sistema. Requer autenticação JWT e role ADMIN.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}

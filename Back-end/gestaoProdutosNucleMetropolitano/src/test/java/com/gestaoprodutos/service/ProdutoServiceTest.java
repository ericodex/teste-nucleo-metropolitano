package com.gestaoprodutos.service;

import com.gestaoprodutos.dto.ProdutoCreateDTO;
import com.gestaoprodutos.dto.ProdutoDTO;
import com.gestaoprodutos.exception.ResourceNotFoundException;
import com.gestaoprodutos.model.entity.Cidade;
import com.gestaoprodutos.model.entity.Produto;
import com.gestaoprodutos.repository.CidadeRepository;
import com.gestaoprodutos.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private CidadeRepository cidadeRepository;

    @InjectMocks
    private ProdutoService produtoService;
 
    private Produto produtoValido;
    private ProdutoDTO produtoDTOValido;
    private ProdutoCreateDTO produtoCreateDTOValido;
    private Cidade cidadeValida;

    @BeforeEach
    void setUp() {
        cidadeValida = new Cidade(1L, "Belo Horizonte", "MG", LocalDateTime.now(), LocalDateTime.now());

        produtoValido = new Produto();
        produtoValido.setId(1L);
        produtoValido.setNome("Caneca Mockito");
        produtoValido.setDescricao("Caneca para testes de Mockito");
        produtoValido.setValor(new BigDecimal("29.99"));
        produtoValido.setEstoque(100);
        produtoValido.setSku("MOCK001");
        produtoValido.setCidade(cidadeValida);
        produtoValido.setAtivo(true);
        produtoValido.setDataCriacao(LocalDateTime.now());
        produtoValido.setDataAtualizacao(LocalDateTime.now());

        produtoDTOValido = new ProdutoDTO();
        produtoDTOValido.setId(1L);
        produtoDTOValido.setNome("Caneca Mockito");
        produtoDTOValido.setDescricao("Caneca para testes de Mockito");
        produtoDTOValido.setValor(new BigDecimal("29.99"));
        produtoDTOValido.setEstoque(100);
        produtoDTOValido.setSku("MOCK001");
        produtoDTOValido.setCidadeId(1L);
        produtoDTOValido.setNomeCidade("Belo Horizonte");
        produtoDTOValido.setAtivo(true);
        produtoDTOValido.setDataCriacao(LocalDateTime.now());
        produtoDTOValido.setDataAtualizacao(LocalDateTime.now());

        produtoCreateDTOValido = new ProdutoCreateDTO();
        produtoCreateDTOValido.setNome("Novo Produto Teste");
        produtoCreateDTOValido.setDescricao("Descricao do novo produto");
        produtoCreateDTOValido.setValor(new BigDecimal("10.50"));
        produtoCreateDTOValido.setEstoque(50);
        produtoCreateDTOValido.setSku("NOVO-SKU-001");
        produtoCreateDTOValido.setCidadeId(1L);
    }

    @Test
    @DisplayName("Deve buscar produto por ID com sucesso")
    void buscarPorId_DeveRetornarProdutoDTO_QuandoIdExiste() {
        when(produtoRepository.findById(anyLong())).thenReturn(Optional.of(produtoValido));

        ProdutoDTO resultado = produtoService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(produtoDTOValido.getId(), resultado.getId());
        assertEquals(produtoDTOValido.getNome(), resultado.getNome());
        verify(produtoRepository, times(1)).findById(anyLong());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando buscar produto por ID inexistente")
    void buscarPorId_DeveLancarResourceNotFoundException_QuandoIdNaoExiste() {
        when(produtoRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            produtoService.buscarPorId(99L);
        });

        assertTrue(thrown.getMessage().contains("Produto não encontrado com id: '99'"));
        verify(produtoRepository, times(1)).findById(anyLong());
    }

    @Test
    @DisplayName("Deve salvar um novo produto com sucesso")
    void salvar_DeveRetornarProdutoDTO_QuandoProdutoEhValido() {
        when(cidadeRepository.findById(anyLong())).thenReturn(Optional.of(cidadeValida));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produtoValido);

        ProdutoDTO resultado = produtoService.salvar(produtoCreateDTOValido);

        assertNotNull(resultado);
        assertEquals(produtoValido.getNome(), resultado.getNome());
        assertEquals(produtoValido.getSku(), resultado.getSku());
        assertEquals(produtoValido.getCidade().getId(), resultado.getCidadeId());
        verify(cidadeRepository, times(1)).findById(anyLong());
        verify(produtoRepository, times(1)).save(any(Produto.class));
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao salvar produto com CidadeId inexistente")
    void salvar_DeveLancarResourceNotFoundException_QuandoCidadeIdNaoExiste() {
        when(cidadeRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            produtoService.salvar(produtoCreateDTOValido);
        });

        assertTrue(thrown.getMessage().contains("Cidade não encontrado com id: '1'"));
        verify(cidadeRepository, times(1)).findById(anyLong());
        verify(produtoRepository, never()).save(any(Produto.class));
    }
}

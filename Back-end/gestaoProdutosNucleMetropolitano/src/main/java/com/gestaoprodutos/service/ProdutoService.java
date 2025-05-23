package com.gestaoprodutos.service;

import com.gestaoprodutos.dto.ProdutoDTO;
import com.gestaoprodutos.dto.ProdutoCreateDTO;
import com.gestaoprodutos.exception.ResourceNotFoundException;
import com.gestaoprodutos.model.entity.Cidade;
import com.gestaoprodutos.model.entity.Produto;
import com.gestaoprodutos.repository.CidadeRepository;
import com.gestaoprodutos.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CidadeRepository cidadeRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CidadeRepository cidadeRepository) {
        this.produtoRepository = produtoRepository;
        this.cidadeRepository = cidadeRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProdutoDTO> listarTodos(Pageable pageable) {
        return produtoRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", "id", id));
    }

    @Transactional
    public ProdutoDTO salvar(ProdutoCreateDTO produtoCreateDTO) {
        Cidade cidade = cidadeRepository.findById(produtoCreateDTO.getCidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Cidade", "id", produtoCreateDTO.getCidadeId()));

        Produto produto = new Produto();
        produto.setNome(produtoCreateDTO.getNome());
        produto.setDescricao(produtoCreateDTO.getDescricao());
        produto.setValor(produtoCreateDTO.getValor());
        produto.setEstoque(produtoCreateDTO.getEstoque());
        produto.setSku(produtoCreateDTO.getSku());
        produto.setCidade(cidade);
        produto.setAtivo(true);

        Produto produtoSalvo = produtoRepository.save(produto);
        return convertToDTO(produtoSalvo);
    }

    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoDTO produtoDTO) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", "id", id));

        Cidade cidade = null;
        if (produtoDTO.getCidadeId() != null) {
            cidade = cidadeRepository.findById(produtoDTO.getCidadeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cidade", "id", produtoDTO.getCidadeId()));
        }

        produtoExistente.setNome(produtoDTO.getNome());
        produtoExistente.setDescricao(produtoDTO.getDescricao());
        produtoExistente.setValor(produtoDTO.getValor());
        produtoExistente.setEstoque(produtoDTO.getEstoque());
        produtoExistente.setSku(produtoDTO.getSku());
        if (cidade != null) {
            produtoExistente.setCidade(cidade);
        }
        produtoExistente.setAtivo(produtoDTO.getAtivo());

        Produto produtoAtualizado = produtoRepository.save(produtoExistente);
        return convertToDTO(produtoAtualizado);
    }

    @Transactional
    public void excluir(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto", "id", id);
        }
        produtoRepository.deleteById(id);
    }

    private ProdutoDTO convertToDTO(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setValor(produto.getValor());
        dto.setEstoque(produto.getEstoque());
        dto.setSku(produto.getSku());
        if (produto.getCidade() != null) {
            dto.setCidadeId(produto.getCidade().getId());
            dto.setNomeCidade(produto.getCidade().getNome());
        }
        dto.setAtivo(produto.getAtivo());
        dto.setDataCriacao(produto.getDataCriacao());
        dto.setDataAtualizacao(produto.getDataAtualizacao());
        return dto;
    }
}

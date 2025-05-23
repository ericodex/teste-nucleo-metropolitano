package com.gestaoprodutos.service;

import com.gestaoprodutos.dto.CidadeDTO;
import com.gestaoprodutos.exception.ResourceNotFoundException;
import com.gestaoprodutos.model.entity.Cidade;
import com.gestaoprodutos.repository.CidadeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("unused")
@Service
public class CidadeService {

    private final CidadeRepository cidadeRepository;

    public CidadeService(CidadeRepository cidadeRepository) {
        this.cidadeRepository = cidadeRepository;
    }

    @Transactional(readOnly = true)
    public List<CidadeDTO> listarTodas() {
        return cidadeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converte uma entidade Cidade para um CidadeDTO.
     * 
     * @param cidade A entidade Cidade a ser convertida.
     * @return O CidadeDTO correspondente.
     */
    private CidadeDTO convertToDTO(Cidade cidade) {
        CidadeDTO dto = new CidadeDTO();
        dto.setId(cidade.getId());
        dto.setNome(cidade.getNome());
        dto.setEstado(cidade.getEstado());
        dto.setDataCriacao(cidade.getDataCriacao());
        dto.setDataAtualizacao(cidade.getDataAtualizacao());
        return dto;
    }
}

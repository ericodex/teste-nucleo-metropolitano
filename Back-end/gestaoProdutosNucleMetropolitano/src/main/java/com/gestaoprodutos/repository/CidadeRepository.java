package com.gestaoprodutos.repository;

import com.gestaoprodutos.model.entity.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Long> {
    List<Cidade> findByNomeContainingIgnoreCase(String nome);

    List<Cidade> findByEstado(String estado);
}
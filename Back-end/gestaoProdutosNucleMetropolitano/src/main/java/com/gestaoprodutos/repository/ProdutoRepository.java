package com.gestaoprodutos.repository;

import com.gestaoprodutos.model.entity.Produto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    Page<Produto> findByValorBetween(BigDecimal valorMin, BigDecimal valorMax, Pageable pageable);

    List<Produto> findByAtivoTrue();

    List<Produto> findByCidadeId(Long cidadeId);

    @Query("SELECT p FROM Produto p WHERE p.estoque < :quantidade")
    List<Produto> findProdutosComEstoqueBaixo(Integer quantidade);

}
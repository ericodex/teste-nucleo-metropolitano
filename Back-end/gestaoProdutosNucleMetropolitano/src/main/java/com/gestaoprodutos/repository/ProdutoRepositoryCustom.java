package com.gestaoprodutos.repository;

import com.gestaoprodutos.model.entity.Produto;

import java.math.BigDecimal;
import java.util.List;

public interface ProdutoRepositoryCustom {
    List<Produto> findProdutosComFiltrosComplexos(String nome, BigDecimal valorMin, BigDecimal valorMax, Long cidadeId);
}
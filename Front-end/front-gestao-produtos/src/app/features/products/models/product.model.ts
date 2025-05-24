// src/app/features/products/models/product.model.ts

/**
 * Interface que representa um Produto (corresponde a com.gestaoprodutos.dto.ProdutoDTO).
 */
export interface Product {
  id?: number; // Opcional, pois é gerado pelo backend
  nome: string;
  descricao?: string;
  valor: number;
  estoque?: number;
  sku: string;
  cidadeId: number;
  nomeCidade?: string; // Campo somente leitura, preenchido pelo backend
  ativo?: boolean;
  dataCriacao?: string; // Formato ISO 8601 (string)
  dataAtualizacao?: string; // Formato ISO 8601 (string)
}

/**
 * Interface que representa a requisição para criar um novo produto (corresponde a ProdutoCreateRequest).
 */
export interface ProductCreateRequest {
  nome: string;
  descricao?: string;
  valor: number;
  estoque?: number;
  sku: string;
  cidadeId: number;
}

/**
 * Interface que representa a estrutura de paginação de uma lista de produtos (corresponde a org.springframework.data.domain.PageCom.gestaoprodutos.dto.ProdutoDTO).
 */
export interface ProductPage {
  totalPages: number;
  totalElements: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  content: Product[]; // Array de produtos na página atual
  number: number; // Número da página atual (base 0)
  first: boolean;
  last: boolean;
  numberOfElements: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

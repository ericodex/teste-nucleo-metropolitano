// src/app/features/products/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductPage,
  ProductCreateRequest,
} from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // A URL base da API de produtos, usando o proxy configurado
  private apiUrl = '/api/v1/produtos';

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os produtos com paginação e ordenação.
   * Corresponde ao endpoint GET /v1/produtos.
   * @param page Número da página (inicia em 0).
   * @param size Número de itens por página.
   * @param sort Critério de ordenação (ex: 'nome,asc' ou 'valor,desc').
   * @returns Um Observable contendo a página de produtos.
   */
  getProducts(
    page: number = 0,
    size: number = 10,
    sort: string = 'nome,asc'
  ): Observable<ProductPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    console.log(`Buscando produtos em: ${this.apiUrl}?${params.toString()}`);
    return this.http.get<ProductPage>(this.apiUrl, { params });
  }

  /**
   * Busca um produto por ID.
   * Corresponde ao endpoint GET /v1/produtos/{id}.
   * @param id O ID do produto.
   * @returns Um Observable contendo o produto encontrado.
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo produto.
   * Corresponde ao endpoint POST /v1/produtos.
   * @param productRequest Os dados para criar o produto.
   * @returns Um Observable contendo o produto criado.
   */
  createProduct(productRequest: ProductCreateRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productRequest);
  }

  /**
   * Atualiza um produto existente.
   * Corresponde ao endpoint PUT /v1/produtos/{id}.
   * @param id O ID do produto a ser atualizado.
   * @param product Os dados atualizados do produto.
   * @returns Um Observable contendo o produto atualizado.
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Exclui um produto.
   * Corresponde ao endpoint DELETE /v1/produtos/{id}.
   * @param id O ID do produto a ser excluído.
   * @returns Um Observable vazio (No Content).
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

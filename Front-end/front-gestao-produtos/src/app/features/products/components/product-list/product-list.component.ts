import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

import { ProdutosService } from '../../../../core/api/services/produtos.service';
import {
  ComGestaoprodutosDtoProdutoDto as Produto, // Use o alias para o DTO de produto único
  OrgSpringframeworkDataDomainPageComGestaoprodutosDtoProdutoDto as ProductPage, // Use o alias para o DTO de página
} from '../../../../core/api/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Produto[] = []; // Usando o modelo ProdutoDTO gerado
  isUserAdmin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  currentSort: string = 'nome,asc';

  constructor(
    private authService: AuthService,
    private router: Router,
    private produtosService: ProdutosService // Injete o serviço de produtos gerado
  ) {}

  ngOnInit(): void {
    this.isUserAdmin = this.authService.isAdmin();
    this.loadProducts();
  }

  /**
   * Carrega a lista de produtos da API usando o serviço gerado.
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // O método gerado para listar produtos deve ser algo como 'listarTodos'
    this.produtosService
      .listarTodos({
        page: this.currentPage,
        size: this.pageSize,
        sort: this.currentSort,
      })
      .subscribe({
        next: (data: ProductPage) => {
          // Usando o modelo de página gerado
          this.products = data.content || []; // Garante que content não seja undefined
          this.totalElements = data.totalElements || 0;
          this.totalPages = data.totalPages || 0;
          this.currentPage = data.number || 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          this.errorMessage =
            'Não foi possível carregar os produtos. Verifique sua conexão ou tente novamente.';
          this.isLoading = false;
          if (error.status === 401 || error.status === 403) {
            this.errorMessage =
              'Sessão expirada ou não autorizado. Por favor, faça login novamente.';
            this.authService.logout();
          }
        },
      });
  }

  goToAddProduct(): void {
    if (this.isUserAdmin) {
      this.router.navigate(['/dashboard/products/new']);
    }
  }

  goToEditProduct(productId: number | undefined): void {
    if (this.isUserAdmin && productId) {
      this.router.navigate(['/dashboard/products/edit', productId]);
    }
  }

  /**
   * Lida com a exclusão de um produto usando o serviço gerado.
   * @param productId ID do produto a ser excluído.
   */
  deleteProduct(productId: number | undefined): void {
    if (!productId) {
      console.error('ID do produto é indefinido para exclusão.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.isLoading = true;
      // O método gerado para excluir produto deve ser algo como 'excluirProduto'
      this.produtosService.excluirProduto({ id: productId }).subscribe({
        next: () => {
          console.log('Produto excluído com sucesso:', productId);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          this.errorMessage = 'Não foi possível excluir o produto.';
          this.isLoading = false;
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Você não tem permissão para excluir produtos.';
            this.authService.logout();
          }
        },
      });
    }
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  onSortChange(sortString: string): void {
    this.currentSort = sortString;
    this.loadProducts();
  }
}

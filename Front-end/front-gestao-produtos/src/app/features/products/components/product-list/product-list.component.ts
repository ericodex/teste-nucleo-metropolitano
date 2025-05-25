import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

import { ProdutosService } from '../../../../core/api/services/produtos.service';
import {
  ComGestaoprodutosDtoProdutoDto as Produto,
  OrgSpringframeworkDataDomainPageComGestaoprodutosDtoProdutoDto as ProductPage,
} from '../../../../core/api/models';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Produto[] = [];
  isUserAdmin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  currentSort: string = 'nome,asc';

  private adminSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.adminSubscription = this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isUserAdmin = isAdmin;
    });
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.produtosService
      .listarTodos({
        page: this.currentPage,
        size: this.pageSize,
        sort: this.currentSort,
      })
      .subscribe({
        next: (data: ProductPage) => {
          // O tipo recebido é diretamente ProductPage
          this.products = data.content || [];
          this.totalElements = data.totalElements || 0;
          this.totalPages = data.totalPages || 0;
          this.currentPage = data.number || 0;
          this.isLoading = false;
        },
        error: (error) => {
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

  deleteProduct(productId: number | undefined): void {
    if (!productId) {
      return;
    }

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.isLoading = true;
      this.produtosService.excluirProduto({ id: productId }).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
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

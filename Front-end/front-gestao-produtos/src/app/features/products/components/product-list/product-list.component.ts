import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas como *ngIf, *ngFor, e pipes como currency
import { Router, RouterLink } from '@angular/router'; // Para navegação
import { AuthService } from '../../../../core/services/auth.service'; // Importa o AuthService
import { ProductService } from '../services/product.service'; // Importe o ProductService
import { Product, ProductPage } from '../../models/product.model'; // Importe os modelos de produto

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule e RouterLink são essenciais
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Usando o modelo Product[]
  isUserAdmin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  currentSort: string = 'nome,asc'; // Parâmetro de ordenação padrão

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService // Injetando o ProductService
  ) {}

  ngOnInit(): void {
    // Verifica a role do usuário ao iniciar o componente
    this.isUserAdmin = this.authService.isAdmin();
    this.loadProducts(); // Carrega os produtos ao iniciar
  }

  /**
   * Carrega a lista de produtos da API (com paginação e ordenação).
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService
      .getProducts(this.currentPage, this.pageSize, this.currentSort)
      .subscribe({
        next: (data: ProductPage) => {
          this.products = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.currentPage = data.number; // Garante que a página atual seja a retornada pela API
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          this.errorMessage =
            'Não foi possível carregar os produtos. Verifique sua conexão ou tente novamente.';
          this.isLoading = false;
          // Você pode adicionar mais lógica de tratamento de erro aqui,
          // como redirecionar para o login se for um erro de autenticação (401)
          if (error.status === 401 || error.status === 403) {
            this.errorMessage =
              'Sessão expirada ou não autorizado. Por favor, faça login novamente.';
            this.authService.logout(); // Redireciona para o login
          }
        },
      });
  }

  /**
   * Navega para a tela de cadastro de novo produto (apenas para ADMIN).
   */
  goToAddProduct(): void {
    if (this.isUserAdmin) {
      this.router.navigate(['/dashboard/products/new']); // Rota para cadastrar
    }
  }

  /**
   * Navega para a tela de edição de produto (apenas para ADMIN).
   * @param productId ID do produto a ser editado.
   */
  goToEditProduct(productId: number | undefined): void {
    if (this.isUserAdmin && productId) {
      // Garante que productId não é undefined
      this.router.navigate(['/dashboard/products/edit', productId]); // Rota para editar
    }
  }

  /**
   * Lida com a exclusão de um produto (apenas para ADMIN).
   * @param productId ID do produto a ser excluído.
   */
  deleteProduct(productId: number | undefined): void {
    if (!productId) {
      console.error('ID do produto é indefinido para exclusão.');
      return;
    }

    // Usando um modal de confirmação customizado em vez de alert/confirm
    // Para este exemplo, vamos simular um modal simples no console.
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      // Substitua por um modal real
      this.isLoading = true;
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Produto excluído com sucesso:', productId);
          this.loadProducts(); // Recarrega a lista após a exclusão
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

  /**
   * Lida com a mudança de página da paginação.
   * @param page O número da nova página.
   */
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  /**
   * Lida com a mudança no critério de ordenação.
   * @param sortString A string de ordenação (ex: 'nome,asc').
   */
  onSortChange(sortString: string): void {
    this.currentSort = sortString;
    this.loadProducts();
  }
}

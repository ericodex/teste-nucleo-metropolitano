import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importe os serviços e modelos gerados pelo OpenAPI usando os aliases corretos
import { ProdutosService } from '../../../../core/api/services/produtos.service';
import { CidadesService } from '../../../../core/api/services/cidades.service';
import {
  ComGestaoprodutosDtoProdutoDto as Produto, // Use o alias para o DTO de produto único
  ProdutoCreateRequest,
  CidadeDto, // Use o alias para o DTO de cidade
} from '../../../../core/api/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  product: Produto = {
    // Usando o alias Produto
    nome: '',
    descricao: '',
    valor: 0.01,
    estoque: 0,
    sku: '',
    cidadeId: 0, // Inicialize com um valor numérico válido
  };

  cities: CidadeDto[] = []; // Usando o alias CidadeDto
  isEditMode: boolean = false;
  productId: number | null = null;
  isLoading: boolean = false;
  formMessage: string | null = null;
  isError: boolean = false;

  constructor(
    private produtosService: ProdutosService,
    private cidadesService: CidadesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCities();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
  }

  loadCities(): void {
    this.cidadesService.listarTodas().subscribe({
      next: (data: CidadeDto[]) => {
        // Usando o alias CidadeDto
        this.cities = data;
        if (!this.isEditMode && this.cities.length > 0) {
          // Garante que cidadeId seja um número válido.
          // Usa o operador de coalescência nula (??) para fornecer 0 se this.cities[0].id for undefined.
          this.product.cidadeId = this.cities[0].id ?? 0;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar cidades:', error);
        this.formMessage =
          'Não foi possível carregar as cidades. Tente novamente.';
        this.isError = true;
      },
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.produtosService.buscarPorId({ id: id }).subscribe({
      next: (data: Produto) => {
        // Usando o alias Produto
        this.product = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.formMessage =
          'Não foi possível carregar os dados do produto para edição.';
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.formMessage = null;
    this.isError = false;

    // Para criação, use ProdutoCreateRequest
    const productDataForCreation: ProdutoCreateRequest = {
      nome: this.product.nome,
      descricao: this.product.descricao,
      valor: this.product.valor,
      estoque: this.product.estoque,
      sku: this.product.sku,
      cidadeId: this.product.cidadeId, // cidadeId já é number aqui
    };

    if (this.isEditMode && this.productId) {
      this.produtosService
        .atualizarProduto({ id: this.productId, body: this.product })
        .subscribe({
          next: (response: Produto) => {
            // Usando o alias Produto
            this.formMessage = `Produto "${response.nome}" atualizado com sucesso!`;
            this.isError = false;
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigate(['/dashboard/products']);
            }, 2000);
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.formMessage =
              'Erro ao atualizar produto. Verifique os dados e tente novamente.';
            this.isError = true;
            this.isLoading = false;
          },
        });
    } else {
      this.produtosService
        .criarProduto({ body: productDataForCreation })
        .subscribe({
          next: (response: Produto) => {
            // Usando o alias Produto
            this.formMessage = `Produto "${response.nome}" cadastrado com sucesso!`;
            this.isError = false;
            this.isLoading = false;
            // Reseta o formulário, garantindo que cidadeId seja um número
            this.product = {
              nome: '',
              descricao: '',
              valor: 0.01,
              estoque: 0,
              sku: '',
              // Usa o operador de coalescência nula (??) para fornecer 0 se this.cities[0].id for undefined.
              cidadeId: this.cities.length > 0 ? this.cities[0].id ?? 0 : 0,
            };
            setTimeout(() => {
              this.router.navigate(['/dashboard/products']);
            }, 2000);
          },
          error: (error) => {
            console.error('Erro ao cadastrar produto:', error);
            this.formMessage =
              'Erro ao cadastrar produto. Verifique os dados e tente novamente.';
            this.isError = true;
            this.isLoading = false;
          },
        });
    }
  }

  goBackToList(): void {
    this.router.navigate(['/dashboard/products']);
  }
}

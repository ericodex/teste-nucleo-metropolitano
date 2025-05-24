import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { ActivatedRoute, Router } from '@angular/router'; // Para obter parâmetros da rota e navegar
import { ProductService } from '../services/product.service'; // Importa o serviço de produtos
import { Product, ProductCreateRequest } from '../../models/product.model'; // Importa os modelos de produto
import { City } from '../../../cities/models/city.model'; // Importe o modelo de Cidade
import { CityService } from '../../../cities/services/city.service'; // Importe o serviço de cidades (precisará criá-lo)

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  // Objeto para vincular os dados do formulário.
  // Pode ser Product (para edição) ou ProductCreateRequest (para criação).
  // Inicializamos com valores padrão para criação.
  product: Product = {
    nome: '',
    descricao: '',
    valor: 0.01,
    estoque: 0,
    sku: '',
    cidadeId: 0, // Será preenchido com o ID da cidade selecionada
  };

  cities: City[] = []; // Lista de cidades para o dropdown
  isEditMode: boolean = false; // Indica se estamos no modo de edição
  productId: number | null = null; // ID do produto se estiver em modo de edição
  isLoading: boolean = false; // Indica se uma requisição está em andamento
  formMessage: string | null = null; // Mensagens de sucesso ou erro do formulário
  isError: boolean = false; // Flag para indicar se a mensagem é de erro

  constructor(
    private productService: ProductService,
    private cityService: CityService, // Injeta o serviço de cidades
    private route: ActivatedRoute, // Para acessar parâmetros da URL
    private router: Router // Para navegação
  ) {}

  ngOnInit(): void {
    // Carrega a lista de cidades ao inicializar o componente
    this.loadCities();

    // Verifica se estamos em modo de edição (se há um 'id' na rota)
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id; // Converte a string do ID para número
        this.loadProduct(this.productId); // Carrega os dados do produto para edição
      }
    });
  }

  /**
   * Carrega a lista de cidades do backend para preencher o dropdown.
   */
  loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (data: City[]) => {
        this.cities = data;
        // Se estiver em modo de criação e houver cidades, pré-seleciona a primeira
        if (!this.isEditMode && this.cities.length > 0) {
          this.product.cidadeId = this.cities[0].id;
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

  /**
   * Carrega os dados de um produto existente para edição.
   * @param id O ID do produto a ser carregado.
   */
  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product = data; // Preenche o formulário com os dados do produto
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

  /**
   * Lida com o envio do formulário (criar ou atualizar produto).
   */
  onSubmit(): void {
    this.isLoading = true;
    this.formMessage = null;
    this.isError = false;

    // Cria um objeto ProductCreateRequest a partir dos dados do formulário
    const productData: ProductCreateRequest = {
      nome: this.product.nome,
      descricao: this.product.descricao,
      valor: this.product.valor,
      estoque: this.product.estoque,
      sku: this.product.sku,
      cidadeId: this.product.cidadeId,
    };

    if (this.isEditMode && this.productId) {
      // Modo de Edição
      this.productService
        .updateProduct(this.productId, this.product)
        .subscribe({
          next: (response: Product) => {
            this.formMessage = `Produto "${response.nome}" atualizado com sucesso!`;
            this.isError = false;
            this.isLoading = false;
            // Opcional: Redirecionar para a lista de produtos após um tempo
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
      // Modo de Criação
      this.productService.createProduct(productData).subscribe({
        next: (response: Product) => {
          this.formMessage = `Produto "${response.nome}" cadastrado com sucesso!`;
          this.isError = false;
          this.isLoading = false;
          // Opcional: Limpar o formulário ou redirecionar
          this.product = {
            nome: '',
            descricao: '',
            valor: 0.01,
            estoque: 0,
            sku: '',
            cidadeId: this.cities.length > 0 ? this.cities[0].id : 0,
          }; // Reseta o formulário
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

  /**
   * Volta para a lista de produtos.
   */
  goBackToList(): void {
    this.router.navigate(['/dashboard/products']);
  }
}

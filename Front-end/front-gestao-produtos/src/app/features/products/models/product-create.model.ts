export interface ProductCreateRequest {
  nome: string;
  descricao?: string;
  valor: number;
  estoque?: number;
  sku: string;
  cidadeId: number;
}

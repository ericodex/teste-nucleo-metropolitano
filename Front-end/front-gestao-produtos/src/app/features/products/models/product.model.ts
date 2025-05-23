export interface Product {
  id?: number;
  nome: string;
  descricao?: string;
  valor: number;
  estoque?: number;
  sku: string;
  cidadeId: number;
  nomeCidade?: string;
  ativo?: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

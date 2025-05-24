// src/app/features/products/products.routes.ts
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component'; // Importe seu componente de formulário

export const productsRoutes: Routes = [
  { path: '', component: ProductListComponent }, // Rota padrão para a lista de produtos
  { path: 'new', component: ProductFormComponent }, // Rota para cadastrar novo produto
  { path: 'edit/:id', component: ProductFormComponent }, // Rota para editar produto
];

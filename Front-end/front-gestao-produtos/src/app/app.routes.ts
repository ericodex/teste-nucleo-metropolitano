import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './features/users/users.component'; // Importe o UsersComponent
import { authRoutes } from './auth/auth.routes';
import { DashboardComponent } from './features/dashboard/dashboard.component'; // Importe o DashboardComponent
import { AuthGuard } from './core/guards/auth.guard'; // Iremos criar este AuthGuard se ainda não tiver

// Importe as rotas de products (se você usar lazy loading para elas)
// import { productsRoutes } from './features/products/products.routes'; // Crie este arquivo se usar lazy loading

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial com os botões "Login" e "Registrar"
  { path: 'auth', children: authRoutes }, // Todas as rotas de autenticação (login, register)

  // Rota do Dashboard (protegida por um AuthGuard)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protege o acesso ao dashboard (usuário deve estar logado)
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' }, // Redireciona /dashboard para /dashboard/products
      // Rotas dos produtos (serão renderizadas dentro do router-outlet do DashboardComponent)
      // Se 'products' for um módulo com lazy loading, use loadChildren:
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.productsRoutes
          ),
        // canActivate: [AuthGuard] // Pode adicionar aqui se precisar de proteção adicional no nível do lazy loading
      },
      // Se 'products' for um componente standalone simples, use component:
      // { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },

      // Rota de usuários (renderizada dentro do router-outlet do DashboardComponent)
      // Você pode adicionar um AdminGuard aqui se apenas ADMINs puderem ver a lista de usuários
      {
        path: 'users',
        component: UsersComponent /* canActivate: [AuthGuard, AdminGuard] */,
      },

      // Adicione mais rotas filhas do dashboard aqui (ex: 'profile', 'settings')
    ],
  },

  { path: '**', redirectTo: '' }, // Rota curinga para redirecionar para a home (pode ser ajustado para '/dashboard' se preferir)
];

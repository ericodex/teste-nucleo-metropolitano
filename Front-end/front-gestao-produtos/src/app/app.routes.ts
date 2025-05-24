import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './features/users/users/users.component';
import { authRoutes } from './auth/auth.routes'; // Importa as rotas de autenticação

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial com os botões "Login" e "Registrar"
  { path: 'auth', children: authRoutes }, // Todas as rotas de autenticação estarão sob /auth/
  { path: 'users', component: UsersComponent }, // Exemplo de rota protegida ou de feature
  // Mais rotas conforme necessário (ex: /dashboard, /products, etc.)
  { path: '**', redirectTo: '' }, // Rota curinga para redirecionar para a home
];

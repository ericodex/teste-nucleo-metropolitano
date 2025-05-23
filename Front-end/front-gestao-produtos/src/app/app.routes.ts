import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Crie este componente
import { UsersComponent } from './features/users/users/users.component'; // Exemplo de componente de recurso

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  // Mais rotas conforme necessário
  { path: '**', redirectTo: '' }, // Rota curinga para redirecionar para a home
];

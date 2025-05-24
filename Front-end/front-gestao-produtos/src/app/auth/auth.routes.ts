import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; // Importe o LoginComponent
import { RegisterComponent } from './components/register/register.component'; // Importe o RegisterComponent

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota para a tela de login
  { path: 'register', component: RegisterComponent }, // Rota para a tela de registro
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireciona /auth para /auth/login
];

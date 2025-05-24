import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Ajustado o caminho do AuthService
import { LoginRequest } from '../../models/login-request.model'; // Ajustado o caminho do modelo

@Component({
  selector: 'app-login', // Alterado de 'app-home' para 'app-login'
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // RouterLink adicionado caso você queira um link direto para o registro dentro do login
  templateUrl: './login.component.html', // Aponta para o novo template de login
  styleUrls: ['./login.component.scss'], // Aponta para o novo estilo de login
})
export class LoginComponent {
  // Alterado de 'HomeComponent' para 'LoginComponent'
  credentials: LoginRequest = {
    email: '',
    senha: '',
  };
  isLoading: boolean = false;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.isLoading = true;
    this.loginError = null;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.isLoading = false;
        this.router.navigate(['/users']); // Ajuste para a rota que deseja após o login (ex: /users ou /dashboard)
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading = false;
        this.loginError =
          error.error?.message ||
          'Credenciais inválidas. Verifique seu email e senha.';
      },
    });
  }

  // O botão de registrar da tela de login pode ser mantido aqui ou removido,
  // dependendo se você quer ter um link para registro dentro do formulário de login.
  // Se quiser, ele aponta para a rota de registro.
  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}

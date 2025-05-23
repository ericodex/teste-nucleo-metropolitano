import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como ngIf
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { Router, RouterLink } from '@angular/router'; // Necessário para navegação
import { AuthService } from '../core/services/auth.service'; // Importa o AuthService
import { LoginRequest } from '../auth/models/login-request.model'; // Importa o modelo de requisição de login

@Component({
  selector: 'app-home',
  standalone: true, // Componente standalone
  imports: [CommonModule, FormsModule], // Importa os módulos necessários
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Objeto para vincular os dados do formulário de login
  credentials: LoginRequest = {
    email: '',
    senha: '',
  };
  isLoading: boolean = false; // Indica se uma requisição está em andamento
  loginError: string | null = null; // Armazena mensagens de erro de login

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Lida com o envio do formulário de login.
   */
  onLogin(): void {
    this.isLoading = true;
    this.loginError = null; // Limpa erros anteriores

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.isLoading = false;
        // Redireciona para a página principal (ex: lista de produtos) após o login
        this.router.navigate(['/products']); // Ajuste para a rota da sua lista de produtos
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading = false;
        // Mensagem de erro padrão ou específica da API
        this.loginError =
          error.error?.message ||
          'Credenciais inválidas. Verifique seu email e senha.';
      },
    });
  }

  /**
   * Redireciona o usuário para a tela de registro.
   */
  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}

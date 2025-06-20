import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
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
        console.log('Login realizado com sucesso!', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
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

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}

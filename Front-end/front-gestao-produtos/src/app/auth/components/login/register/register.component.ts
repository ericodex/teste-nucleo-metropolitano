import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../models/register-request.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  // REMOVIDO: HttpClientModule dos imports
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: RegisterRequest = {
    nome: '',
    email: '',
    senha: '',
    cpf: '',
  };
  registrationSuccess: boolean = false;
  registrationError: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.registrationError = null;
    this.registrationSuccess = false;

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.registrationSuccess = true;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
        this.registrationError = 'Erro ao registrar usuário. Tente novamente.';
        if (error.status === 400 && error.error) {
          this.registrationError =
            error.error.message ||
            'Email ou CPF já cadastrado, ou dados inválidos.';
        } else {
          this.registrationError =
            'Ocorreu um erro inesperado. Por favor, tente mais tarde.';
        }
        this.isLoading = false;
      },
    });
  }
}

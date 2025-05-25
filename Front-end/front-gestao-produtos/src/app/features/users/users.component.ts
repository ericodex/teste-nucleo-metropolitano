import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { AutenticacaoService } from '../../core/api/services/autenticacao.service';
import { ComGestaoprodutosModelEntityUsuario as Usuario } from '../../core/api/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.autenticacaoService.listAllUsers().subscribe({
      next: (data: Usuario[]) => {
        this.users = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.errorMessage =
          'Não foi possível carregar os usuários. Verifique sua conexão ou tente novamente.';
        this.isLoading = false;
        if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Sessão expirada ou não autorizado. Por favor, faça login novamente.';
          this.authService.logout();
        }
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf
import { Router, RouterLink, RouterModule } from '@angular/router'; // RouterLink para links no template, RouterModule para <router-outlet>
import { AuthService } from '../../core/services/auth.service'; // Importa o AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Importa os módulos necessários para o template:
  // CommonModule: para diretivas estruturais (ex: *ngIf)
  // RouterLink: para links declarativos (ex: routerLink="/dashboard/products")
  // RouterModule: para o <router-outlet> funcionar corretamente
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isUserAdmin: boolean = false; // Propriedade para controlar a visibilidade de elementos para ADMIN

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método de ciclo de vida do Angular, chamado após a inicialização do componente.
   * Usado aqui para verificar a role do usuário.
   */
  ngOnInit(): void {
    // Verifica se o usuário logado possui a role 'ADMIN'
    // O método isAdmin() está definido no AuthService.
    this.isUserAdmin = this.authService.isAdmin();
  }

  /**
   * Navega para a rota de listagem de produtos dentro do dashboard.
   */
  goToProducts(): void {
    this.router.navigate(['/dashboard/products']);
  }

  /**
   * Navega para a rota de listagem de usuários dentro do dashboard.
   * Esta rota pode ser protegida adicionalmente por um AdminGuard.
   */
  goToUsers(): void {
    this.router.navigate(['/dashboard/users']);
  }

  /**
   * Realiza o logout do usuário e redireciona para a tela de login.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

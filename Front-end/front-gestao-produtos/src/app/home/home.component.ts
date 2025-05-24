import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // RouterLink para links no template

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importe RouterLink aqui para usar no template
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Método para redirecionar para a tela de login
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método para redirecionar para a tela de registro
  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}

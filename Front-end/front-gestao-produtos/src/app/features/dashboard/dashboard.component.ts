import { Component, OnInit, OnDestroy } from '@angular/core'; // Importe OnDestroy
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs'; // Importe Subscription

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Implemente OnDestroy
  isUserAdmin: boolean = false;
  private adminSubscription: Subscription | undefined; // Para gerenciar a inscrição

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Inscreve-se no Observable isAdmin$ para reagir a mudanças
    this.adminSubscription = this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isUserAdmin = isAdmin;
      // Opcional: log para depuração
      console.log('DashboardComponent: isUserAdmin atualizado para:', this.isUserAdmin);
    });
  }

  ngOnDestroy(): void {
    // Desinscreve-se para evitar vazamento de memória quando o componente for destruído
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
  }

  goToProducts(): void {
    this.router.navigate(['/dashboard/products']);
  }

  goToUsers(): void {
    this.router.navigate(['/dashboard/users']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

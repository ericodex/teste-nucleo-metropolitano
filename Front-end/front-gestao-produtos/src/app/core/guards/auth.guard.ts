import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs'; // Importe 'map'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determina se uma rota pode ser ativada.
   * Verifica o estado de login do usuário através do AuthService.
   * Se não estiver logado, redireciona para a tela de login.
   * @param route O snapshot da rota que está sendo ativada.
   * @param state O snapshot do estado do roteador.
   * @returns Um Observable que emite true se o usuário estiver logado, false caso contrário.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Usamos o Observable isLoggedIn$ do AuthService para reagir a mudanças no estado de login.
    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          // Se o usuário estiver logado, permite o acesso à rota.
          return true;
        } else {
          // Se o usuário não estiver logado, redireciona para a tela de login
          // e impede o acesso à rota.
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}

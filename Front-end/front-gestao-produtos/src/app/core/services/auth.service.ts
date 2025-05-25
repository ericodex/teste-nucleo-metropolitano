import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, from } from 'rxjs';
import {
  tap,
  catchError,
  switchMap,
  filter,
  map as rxjsMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';

import { AutenticacaoService } from '../api/services/autenticacao.service';
import {
  ComGestaoprodutosDtoRequestLoginRequest as LoginRequest,
  ComGestaoprodutosDtoRequestRegisterRequest as RegisterRequest,
  ComGestaoprodutosDtoResponseJwtResponse as JwtResponse,
} from '../api/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  private _isAdmin = new BehaviorSubject<boolean>(this.checkIfAdmin());
  public isAdmin$ = this._isAdmin.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private autenticacaoService: AutenticacaoService
  ) {}

  private hasToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  private checkIfAdmin(): boolean {
    const token = this.getAccessToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));

        let roles: string[] = [];
        if (payload.roles) {
          if (Array.isArray(payload.roles)) {
            roles = payload.roles;
          } else if (typeof payload.roles === 'string') {
            roles = [payload.roles];
          }
        }

        const processedRoles = roles.map(
          (role) => (role.startsWith('ROLE_') ? role.substring(5) : role)
        );

        return processedRoles.includes('ADMIN');
      } catch (e) {
        console.error('AuthService: Erro ao decodificar ou parsear token JWT para verificar admin:', e);
        return false;
      }
    }
    return false;
  }

  register(userData: RegisterRequest): Observable<number> {
    return this.autenticacaoService.register({ body: userData });
  }

  login(credentials: LoginRequest): Observable<boolean> {
    return this.autenticacaoService.login({ body: credentials }).pipe(
      switchMap((responseBlob: Blob | JwtResponse) => {
        if (responseBlob instanceof Blob) {
          return from(responseBlob.text()).pipe(
            rxjsMap((text) => {
              try {
                return JSON.parse(text) as JwtResponse;
              } catch (e) {
                throw new Error('Falha ao parsear resposta do backend.');
              }
            })
          );
        }
        return of(responseBlob as JwtResponse);
      }),
      tap((response: JwtResponse) => {
        if (response && response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('token_type', response.tokenType || 'Bearer');
          this._isLoggedIn.next(true);
          this._isAdmin.next(this.checkIfAdmin());
        } else {
          this._isLoggedIn.next(false);
          this._isAdmin.next(false);
        }
      }),
      switchMap(() => this.isLoggedIn$),
      filter((isLoggedIn) => isLoggedIn === true),
      catchError((error) => {
        this._isLoggedIn.next(false);
        this._isAdmin.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    this._isLoggedIn.next(false);
    this._isAdmin.next(false);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getTokenType(): string | null {
    return localStorage.getItem('token_type');
  }

  // O método isAdmin() agora só retorna o valor atual do BehaviorSubject.
  // Ele não precisa fazer a decodificação do token novamente aqui.
  isAdmin(): boolean {
    return this._isAdmin.getValue();
  }
}

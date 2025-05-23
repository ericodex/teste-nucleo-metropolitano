import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { RegisterRequest } from '../../auth/models/register-request.model';
import { RegistrationResponse } from '../../auth/models/registration-response.model';
import { LoginRequest } from '../../auth/models/login-request.model';
import { JwtResponse } from '../../auth/models/jwt-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseAuthUrl = '/api/v1/auth';

  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn.asObservable(); // Observable público

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  register(userData: RegisterRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      `${this.baseAuthUrl}/register`,
      userData
    );
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.baseAuthUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('token_type', response.tokenType);
          this._isLoggedIn.next(true);
        }),
        catchError((error) => {
          this._isLoggedIn.next(false);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    this._isLoggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getTokenType(): string | null {
    return localStorage.getItem('token_type');
  }

  isAdmin(): boolean {
    const token = this.getAccessToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload.roles && payload.roles.includes('ADMIN');
      } catch (e) {
        console.error('Erro ao decodificar token JWT:', e);
        return false;
      }
    }
    return false;
  }
}

// src/app/core/services/jwt-interceptor.service.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importe seu AuthService

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Intercepta requisições HTTP para adicionar o token JWT.
   * @param request A requisição HTTP.
   * @param next O próximo manipulador na cadeia de interceptores.
   * @returns Um Observable de HttpEvent.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    const tokenType = this.authService.getTokenType(); // Geralmente 'Bearer'

    // Clona a requisição e adiciona o cabeçalho de Autorização se um token existir
    if (accessToken && tokenType) {
      request = request.clone({
        setHeaders: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
    }

    return next.handle(request);
  }
}

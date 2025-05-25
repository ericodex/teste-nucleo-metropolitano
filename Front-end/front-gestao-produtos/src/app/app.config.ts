import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS, // Importe HTTP_INTERCEPTORS
} from '@angular/common/http';

import { routes } from './app.routes';
import { ApiModule } from './core/api/api.module';
import { ApiConfigurationParams } from './core/api/api-configuration';
import { JwtInterceptor } from './core/services/jwt-interceptor.service'; // Importe seu JwtInterceptor

const apiConfigParams: ApiConfigurationParams = {
  rootUrl: 'http://localhost:13434/api',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Necessário para serviços que usam HttpClient
    importProvidersFrom(ApiModule.forRoot(apiConfigParams)), // Para prover os serviços do ApiModule
    // Adicione esta linha para registrar o seu JwtInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
};

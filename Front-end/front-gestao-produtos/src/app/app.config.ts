import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';
import { ApiModule } from './core/api/api.module';
import { ApiConfigurationParams } from './core/api/api-configuration';

const apiConfigParams: ApiConfigurationParams = {
  rootUrl: 'http://localhost:13434', // Substitua pela URL base da sua API
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Necessário para serviços que usam HttpClient
    importProvidersFrom(ApiModule.forRoot(apiConfigParams)), // Para prover os serviços do ApiModule
  ],
};

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { laravelInterceptor } from './common/interceptors/laravel-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { API_BASE_URL } from './common/clients/clients';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([laravelInterceptor])),
    {
      provide: API_BASE_URL,
      useValue: "http://localhost:8000"
    }
  ]
};

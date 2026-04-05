import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { laravelInterceptor } from './common/interceptors/laravel-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { API_BASE_URL } from './common/clients/clients';
import { environment } from '../environments/environment';
import { logoutInterceptor } from './common/interceptors/logout-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([laravelInterceptor, logoutInterceptor])),
    {
      provide: API_BASE_URL,
      useValue: environment.baseUrl
    }
  ]
};

import { CurrencyPipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import * as core from '@angular/core';
import { enableProdMode, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // Add this
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';
import { provideNgxStripe } from 'ngx-stripe';
import { AppComponent } from './app/app.component';
import { PAGE_ROUTES } from './app/shared/routes/all-routes.route';
import { environment } from './environments/environment';
import { RouteDataResolver } from './services/request/route-data.resolver';

if (environment.production) {
  enableProdMode();
}

// Update this to not use the deperecated Animations
bootstrapApplication(AppComponent, {
  providers: [
    provideNgxStripe(environment.stripePublicKey),
    provideZoneChangeDetection(),
    provideAnimations(),
    CurrencyPipe,
    (core as any).provideBrowserGlobalErrorListeners?.() || [], // Conditional for Angular v19
    provideRouter(PAGE_ROUTES),
    provideAuth0({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        audience: environment.auth0Audience,
        redirect_uri: globalThis.location.origin + '/demo-app',
      },
      httpInterceptor: {
        allowedList: environment.auth0AllowedList,
      },
    }),
    // Routes and Router
    provideRouter(PAGE_ROUTES),
    ...RouteDataResolver.resolvers,

    // HTTP client with JWT interceptor
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),

    // App initializer for Material icons
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-rounded');
    }),

    // Service Worker
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:3000',
    }),

    // Skeleton loader service
    provideNgxSkeletonLoader({
      theme: {
        extendsFromRoot: true,
        '--ngx-skeleton-loader-animation-duration': '1.5s',
      },
      animation: 'progress',
    }),

    // Environment
    {
      provide: 'env',
      useValue: environment,
    },

    // Material defaults
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { touchGestures: 'off' } },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { autoFocus: 'dialog', restoreFocus: true },
    },
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { autoFocus: 'bottom-sheet', restoreFocus: true },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic', floatLabel: 'always' },
    },
  ],
});

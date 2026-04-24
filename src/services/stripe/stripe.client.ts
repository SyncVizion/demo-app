import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { injectStripe } from 'ngx-stripe';
import { ThemeService } from '../user/theme.service';

@Injectable({
  providedIn: 'root',
})
export class StripeClient {
  private readonly stripeInjection = injectStripe();
  private readonly destroyRef = inject(DestroyRef);

  private styleData: Appearance['variables'];

  constructor() {
    ThemeService.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setupStyles());
  }

  get stripe() {
    return this.stripeInjection;
  }

  getPaymentOptions(secret: string): StripeElementsOptions {
    return {
      locale: 'en',
      clientSecret: secret,
      appearance: {
        theme: 'night',
        labels: 'floating',
        variables: this.styleData,
        rules: {
          '.Input': {
            border: `1px solid ${this.getStyle('--mat-sys-outline')}`,
          },
        },
      },
    };
  }

  setupStyles() {
    this.styleData = {
      colorBackground: this.getStyle('--mat-sys-background'), // Input Background Color
      colorText: this.getStyle('--mat-text-color'),
      colorPrimary: this.getStyle('--mat-sys-primary'),
      focusBoxShadow: 'none',
      focusOutline: 'none',
      borderRadius: '12px',
    };
  }

  private getStyle(property: string): string {
    return getComputedStyle(document.body).getPropertyValue(property);
  }
}

import { Component, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StripeElementsDirective, StripePaymentElementComponent } from 'ngx-stripe';
import { Observable, Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { BaseDialogComponent } from 'src/app/shared/components/dialogs/base-dialog/dialog-base.component';
import { StripeSubscriptionService } from 'src/services/stripe/stripe-subscription.service';
import { StripeClient } from 'src/services/stripe/stripe.client';

@Component({
  selector: 'app-payment-change-dialog',
  templateUrl: './payment-change-dialog.component.html',
  imports: [
    MatDialogModule,
    RouterModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    MatProgressSpinnerModule,
    StripePaymentElementComponent,
    StripeElementsDirective,
  ],
})
export class PaymentChangeDialogComponent extends BaseDialogComponent implements OnInit {
  private readonly stripeSubService = inject(StripeSubscriptionService);
  private readonly popupService = inject(PopupService);
  private readonly stripeClient = inject(StripeClient);
  private readonly saved$ = new Subject<any>();

  paymentElement = viewChild<StripePaymentElementComponent>(StripePaymentElementComponent);

  elementsOptions: StripeElementsOptions;
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };
  loading = true;

  ngOnInit() {
    this.stripeSubService.createNewSetupIntent().subscribe({
      next: (response) => {
        this.elementsOptions = this.stripeClient.getPaymentOptions(response);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.popupService.error('Failed to initialize payment method change. Please try again later.');
        this.close();
      },
    });
  }

  submit() {
    this.stripeClient.stripe
      .confirmSetup({
        elements: this.paymentElement().elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${'shawn'} ${'stachler'}`,
              email: 'shawn.stachler@syncvizion.com',
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe((result) => {
        if (result.error) {
          this.popupService.error('Payment method update failed. Please try again later.');
        } else if (result?.setupIntent?.status === 'succeeded') {
          this.popupService.success('Payment method updated successfully!');
          this.saved$.next(result);
          this.close();
        }
      });
  }

  onSaved(): Observable<any> {
    return this.saved$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}

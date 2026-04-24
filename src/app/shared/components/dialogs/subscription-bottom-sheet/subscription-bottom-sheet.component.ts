import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StripeElementsDirective, StripePaymentElementComponent } from 'ngx-stripe';
import { CardBottomSheetComponent } from 'src/app/pages/cards/detail/bottom-sheet/card-bottom-sheet.component';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';
import { StripeProductService } from 'src/services/stripe/stripe-product.service';
import { StripeSubscriptionService } from 'src/services/stripe/stripe-subscription.service';
import { StripeClient } from 'src/services/stripe/stripe.client';
import { ButtonModule } from '../../core/button/button.module';
import { CardModule } from '../../core/card/card.module';
import { IconModule } from '../../core/icon/icon.module';

@Component({
  selector: 'app-subscription-bottom-sheet',
  templateUrl: 'subscription-bottom-sheet.component.html',
  imports: [
    MatBottomSheetModule,
    StripePaymentElementComponent,
    StripeElementsDirective,
    IconModule,
    CardModule,
    MatRadioModule,
    ButtonModule,
    CurrencyPipe,
    AppSkeletonLoaderDirective,
  ],
})
export class SubscriptionBottomSheetComponent implements OnInit {
  private readonly stripeClient = inject(StripeClient);
  private readonly stripeProductService = inject(StripeProductService);
  private readonly stripeSubscriptionService = inject(StripeSubscriptionService);

  sheetRef = inject(MatBottomSheetRef<CardBottomSheetComponent>);
  data = inject(MAT_BOTTOM_SHEET_DATA);
  destroyRef = inject(DestroyRef);

  selectedSubscription: any;
  paymentElement = viewChild<StripePaymentElementComponent>(StripePaymentElementComponent);
  paymentElementForm: UntypedFormGroup;

  products: any[];
  loading = false;

  elementOptions: StripeElementsOptions;
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  ngOnInit(): void {
    this.stripeProductService.get().subscribe((prods) => {
      console.log(prods);
      this.products = prods;
      this.selectedSubscription = this.products[0];
    });
  }

  close() {
    this.sheetRef.dismiss();
  }

  onSubscribe() {
    this.loading = true;
    this.stripeSubscriptionService.createNewSubscrption(this.selectedSubscription.price.id).subscribe((response) => {
      this.elementOptions = this.stripeClient.getPaymentOptions(response.subscriptionSecret);
      this.loading = false;
    });
  }

  pay() {
    // if (this.paying() || this.paymentElementForm.invalid) return;
    // this.paying.set(true);

    const { firstName, lastName, email } = this.paymentElementForm.getRawValue();

    this.stripeClient.stripe
      .confirmSetup({
        elements: this.paymentElement().elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`,
              email: email,
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe((result) => {
        // this.paying.set(false);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.setupIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }
}

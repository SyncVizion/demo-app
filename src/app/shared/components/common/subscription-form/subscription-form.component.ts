import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Appearance, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StripePaymentElementComponent } from 'ngx-stripe';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { DialogService } from 'src/services/dialog.service';
import { StripeCustomerService } from 'src/services/stripe/stripe-customer.service';
import { ButtonModule } from '../../core/button/button.module';
import { FormModule } from '../../core/form/form.module';
import { PopupService } from '../../core/popup/popup.service';
import { SubscriptionBottomSheetComponent } from '../../dialogs/subscription-bottom-sheet/subscription-bottom-sheet.component';

@Component({
  selector: 'subscription-form',
  templateUrl: './subscription-form.component.html',
  standalone: true,
  imports: [FormModule, ButtonModule],
})
export class SubscriptionFormComponent implements OnInit {
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly stripeCustomerService = inject(StripeCustomerService);
  private readonly popupService = inject(PopupService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly dialogService = inject(DialogService);

  paymentElement = viewChild<StripePaymentElementComponent>(StripePaymentElementComponent);
  paymentElementForm: UntypedFormGroup;

  paying = signal(false);
  createCustomerLoading = signal(false);

  elementsOptions: StripeElementsOptions;
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  styleData: Appearance['variables'];

  ngOnInit() {
    this.userAccessService.user$.subscribe((user) => {
      this.paymentElementForm = this.formBuilder.group({
        firstName: ['John', [Validators.required]],
        lastName: ['Doe', [Validators.required]],
        // email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
        email: [{ value: 'test.user@example.com', disabled: true }, [Validators.required, Validators.email]],
      });
    });
  }

  save() {
    this.createCustomerLoading.set(true);
    const { firstName, lastName } = this.paymentElementForm.getRawValue();
    this.stripeCustomerService.create(firstName, lastName).subscribe({
      next: (response) => {
        this.popupService.success(`Stripe customer created successfully`);
        this.createCustomerLoading.set(false);
        this.openSubscriptionSheet();
      },
      error: () => {
        this.popupService.error('Unable to create Stripe customer');
        this.createCustomerLoading.set(false);
      },
    });
  }

  openSubscriptionSheet() {
    this.dialogService.openSheet(SubscriptionBottomSheetComponent, {
      height: '90vh',
    });
  }
}

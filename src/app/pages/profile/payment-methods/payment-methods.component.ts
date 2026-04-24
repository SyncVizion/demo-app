import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopoverModule } from 'src/app/shared/components/core/popover/popover.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { StripeCustomerService } from 'src/services/stripe/stripe-customer.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  imports: [CardModule, HeaderModule, IconModule, ButtonModule, MatSlideToggleModule, MatMenuModule, PopoverModule],
})
export class PaymentMethodsComponent implements OnInit {
  private readonly stripeCustomerService = inject(StripeCustomerService);
  private readonly popupService = inject(PopupService);

  paymentMethods: any[];

  ngOnInit() {
    this.stripeCustomerService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response;
      },
      error: () => {
        this.popupService.error('Failed to fetch payment methods. Please try again later.');
      },
    });
  }
}

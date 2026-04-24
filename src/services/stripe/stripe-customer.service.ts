import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class StripeCustomerService {
  private readonly requestService = inject(RequestService);

  create(firstName: string, lastName: string): Observable<any> {
    return this.requestService.post(`v1/stripe/customer`, { firstName, lastName });
  }

  getPaymentMethods(): Observable<any> {
    return this.requestService.get(`v1/stripe/customer/payment-methods`);
  }
}

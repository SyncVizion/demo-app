import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class StripeSubscriptionService {
  private readonly requestService = inject(RequestService);

  get(): Observable<any> {
    return this.requestService.get(`v1/stripe/subscription`);
  }

  getAll(): Observable<any> {
    return this.requestService.get(`v1/stripe/subscriptions`);
  }

  createNewSubscrption(priceId: string): Observable<any> {
    return this.requestService.post(`v1/stripe/subscription`, priceId);
  }

  createNewSetupIntent(): Observable<any> {
    return this.requestService.getText(`v1/stripe/subscription/intent`);
  }

  cancelSubscription(): Observable<any> {
    return this.requestService.put(`v1/stripe/subscription/cancel`);
  }

  uncancelSubscription(): Observable<any> {
    return this.requestService.put(`v1/stripe/subscription/uncancel`);
  }
}

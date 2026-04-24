import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class StripeProductService {
  private readonly requestService = inject(RequestService);

  get(): Observable<any> {
    return this.requestService.get(`v1/stripe/products`);
  }
}

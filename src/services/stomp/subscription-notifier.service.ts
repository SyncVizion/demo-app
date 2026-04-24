import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './notification.model';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionNotifier {
  private readonly subscriptionService = inject(SubscriptionService);

  /**
   * Listens to the workflow updates for a specific path.
   *
   * @param path The path to listen for workflow updates.
   * @returns Observable of Notification objects.
   */
  listen(path: string): Observable<Notification> {
    this.subscriptionService.init();
    return this.subscriptionService.listen(path);
  }
}

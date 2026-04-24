import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { SubscriptionService } from 'src/services/stomp/subscription.service';
import { PopupService } from '../../core/popup/popup.service';

@Component({
  selector: 'app-user-notification',
  template: ``,
})
export class UserNotificationComponent implements OnInit, OnDestroy {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly popupService = inject(PopupService);

  private readonly USER_SOCKET_URL = '/queue/user/notification';
  destroy = new Subject<void>();

  ngOnDestroy() {
    this.destroy.next();
  }

  ngOnInit() {
    this.subscriptionService.init();
    this.subscriptionService
      .listen(this.USER_SOCKET_URL, true)
      .pipe(
        // tap((res) => this.popupService.showNotification(res)),
        tap((res) => console.log('NEW NOTIFICATION', res)),
        takeUntil(this.destroy),
      )
      .subscribe();
  }
}

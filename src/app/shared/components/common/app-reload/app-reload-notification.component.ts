import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { SubscriptionService } from 'src/services/stomp/subscription.service';
import { PopupService } from '../../core/popup/popup.service';

@Component({
  selector: 'app-app-reload-notification',
  template: ``,
})
export class AppReloadNotificationComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly popupService = inject(PopupService);

  private readonly RELOAD_SOCKET_URL = '/topic/reload';
  destroyRef = inject(DestroyRef);
  newAppVersion = output<boolean>();

  ngOnInit() {
    this.subscriptionService.init();
    this.subscriptionService
      .listen(this.RELOAD_SOCKET_URL)
      .pipe(
        tap(() => {
          this.popupService.appUpdate();
          this.newAppVersion.emit(true);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}

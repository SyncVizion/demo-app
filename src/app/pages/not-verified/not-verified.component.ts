import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';

@Component({
  selector: 'app-not-verified',
  templateUrl: './not-verified.component.html',
  styleUrls: ['./not-verified.component.scss'],
  imports: [CardModule, ButtonModule],
})
export class NotVerifiedComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupService);

  email = '-';
  verifyLoading = false;

  ngOnInit() {
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user?.email) {
        this.email = user.email;
      }
    });
  }

  checkVerification() {
    globalThis.location.reload();
  }
}

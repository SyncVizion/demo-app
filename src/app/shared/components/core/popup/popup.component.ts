import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ButtonModule } from '../button/button.module';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss'],
  host: {
    class: 'app-snackbar__container',
    '(click)': '!data?.disableContainerClick ?  snackBarRef.dismiss() : null',
  },
  imports: [MatIconModule, ButtonModule],
})
export class PopupComponent {
  data = inject(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);
}

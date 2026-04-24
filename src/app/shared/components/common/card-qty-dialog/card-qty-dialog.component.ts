import { Component, inject, model, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { FormModule } from '../../core/form/form.module';
import { BaseDialogComponent } from '../../dialogs/base-dialog/dialog-base.component';

@Component({
  selector: 'app-card-qty-dialog',
  templateUrl: './card-qty-dialog.component.html',
  styleUrls: ['./card-qty-dialog.component.scss'],
  imports: [FormModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ButtonModule],
})
export class CardQtyDialogComponent extends BaseDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly saved$ = new Subject<number>();

  form: FormGroup;
  quantity = model(0);
  saved = output<number>();

  ngOnInit() {
    console.log('Received data in dialog:', this.data);
    this.form = this.fb.group({
      quantity: [this.data ? this.data.quantity : 0],
    });
  }

  completeSave() {
    this.saved$.next(this.form.value.quantity);
  }

  onSave() {
    return this.saved$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}

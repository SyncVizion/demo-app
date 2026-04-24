import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-base-dialog',
  template: '',
})
export abstract class BaseDialogComponent {
  protected data: any = inject(MAT_DIALOG_DATA);
  protected dialogRef = inject(MatDialogRef<BaseDialogComponent>);
  protected destroyRef = inject(DestroyRef);
  loading = false;

  close(result?: any) {
    this.dialogRef.close(result);
  }
}

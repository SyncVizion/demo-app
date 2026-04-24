import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-base-bottom-sheet',
  template: '',
})
export abstract class BaseBottomSheetComponent {
  protected data: any = inject(MAT_BOTTOM_SHEET_DATA);
  protected sheetRef = inject(MatBottomSheetRef<BaseBottomSheetComponent>);
  protected destroyRef = inject(DestroyRef);
  loading = false;

  close(result?: any) {
    this.sheetRef.dismiss(result);
  }
}

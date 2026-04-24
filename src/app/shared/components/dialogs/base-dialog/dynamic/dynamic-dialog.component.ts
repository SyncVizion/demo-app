import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  template: '',
})
export abstract class DynamicDialogComponent {
  protected data: any;
  protected ref: MatDialogRef<DynamicDialogComponent> | MatBottomSheetRef<DynamicDialogComponent>;
  private readonly dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  private readonly bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });
  private readonly dialogRef = inject(MatDialogRef<DynamicDialogComponent>, { optional: true });
  private readonly bottomSheetRef = inject(MatBottomSheetRef<DynamicDialogComponent>, { optional: true });
  protected destroyRef = inject(DestroyRef);
  protected isDialog = false;
  protected isBottomSheet = false;
  protected loading = false;

  constructor() {
    this.data = this.dialogData ?? this.bottomSheetData;
    this.ref = this.dialogRef ?? this.bottomSheetRef;
    this.isDialog = this.ref instanceof MatDialogRef;
    this.isBottomSheet = this.ref instanceof MatBottomSheetRef;
  }

  close(result?: any) {
    if (this.ref instanceof MatDialogRef) {
      this.ref.close(result);
    } else {
      this.ref.dismiss(result);
    }
  }
}

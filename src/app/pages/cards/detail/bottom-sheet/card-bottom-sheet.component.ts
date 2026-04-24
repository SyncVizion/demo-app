import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-card-bottom-sheet',
  templateUrl: './card-bottom-sheet.component.html',
  styleUrls: ['./card-bottom-sheet.component.scss'],
  host: {
    class: 'card-bottom-sheet-container',
  },
  imports: [MatBottomSheetModule],
})
export class CardBottomSheetComponent {
  sheetRef = inject(MatBottomSheetRef<CardBottomSheetComponent>);
  data = inject(MAT_BOTTOM_SHEET_DATA);

  destroyRef = inject(DestroyRef);

  close() {
    this.sheetRef.dismiss();
  }
}

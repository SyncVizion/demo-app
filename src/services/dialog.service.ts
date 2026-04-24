import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly breakpointObserver = inject(BreakpointObserver);


  /**
   * Opens a dialog with the specified component and configuration.
   *
   * @param component The component to be opened in the dialog.
   * @param config Additional configuration options for the dialog.
   * @returns A reference to the opened dialog.
   */
  open<T, D>(component: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, any> {
    const combinedConfig = {
      width: '500px',
      maxWidth: '95vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      ...config,
    };
    return this.dialog.open(component, combinedConfig);
  }

  /**
   * Opens a bottom sheet with the specified component and configuration.
   *
   * @param component The component to be opened in the bottom sheet.
   * @param config Additional configuration options for the bottom sheet.
   * @returns A reference to the opened bottom sheet.
   */
  openSheet<T, D>(component: ComponentType<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, any> {
    const combinedConfig = {
      panelClass: 'app-bottom-sheet',
      closeOnNavigation: true,
      height: '300px',
      maxHeight: '95vh',
      ...config,
    };

    return this.bottomSheet.open(component, combinedConfig);
  }

  /**
   * Dynamically opens a dialog or bottom sheet based on the screen size. The component being opened
   * must extend DynamicDialogComponent. The small screen match width will default to '500px'.
   *
   * @param component The component to be opened in the dialog or bottom sheet.
   * @param config Additional configuration options for the dialog or bottom sheet.
   * @param matchWidth The maximum width to match for opening in a bottom sheet. Defaults to '500px'.
   * @returns The component instance of the opened dialog or bottom sheet.
   */
  openDynamic<T, D>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D> | MatBottomSheetConfig<D>,
    matchWidth = '500px',
  ): T {
    const matched = this.breakpointObserver.isMatched(`(max-width: ${matchWidth})`);

    if (matched) {
      const finalConfig = (config ?? {}) as MatBottomSheetConfig<D>;
      if (!finalConfig.height) {
        finalConfig.height = '85%';
      }
      return this.openSheet(component, finalConfig).componentRef.instance;
    } else {
      const finalConfig = (config ?? {}) as MatDialogConfig<D>;
      if (finalConfig.height) {
        delete finalConfig.height;
      }
      return this.open(component, finalConfig).componentInstance;
    }
  }
}

import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { PopupComponent } from './popup.component';

/**
 * Service for showing notifications in the application. It will add the component to
 * the specified container that is passed in.
 *
 * @author Sam Butler
 * @since August 11, 2022
 */
@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly HORIZONTAL: MatSnackBarHorizontalPosition = 'right';
  private readonly VERTICAL: MatSnackBarVerticalPosition = 'top';
  private readonly BOTTOM: MatSnackBarVerticalPosition = 'bottom';
  private readonly DURATION = 3000;

  open(
    message: string,
    prefixIcon: string,
    suffixIcon: string,
    config?: MatSnackBarConfig,
  ): MatSnackBarRef<PopupComponent> {
    const defaultSettings: MatSnackBarConfig = {
      ...config,
      horizontalPosition: this.HORIZONTAL,
      verticalPosition: this.BOTTOM,
      duration: this.DURATION,
      data: { message, prefixIcon, suffixIcon },
    };

    return this.snackBar.openFromComponent(PopupComponent, defaultSettings);
  }

  /**
   * Shows a SUCCESS toast message with the given message and
   * title of the popup.
   *
   * @param message The message to display.
   * @param title The title of the popup.
   * @returns The active toast message object.
   */
  success(message: string): MatSnackBarRef<PopupComponent> {
    return this.open(message, 'check_circle', null, {
      panelClass: ['app-snackbar', 'app-snackbar--success', 'pointer'],
    });
  }

  /**
   * Shows a WARNING toast message with the given message and
   * title of the popup.
   *
   * @param message The message to display.
   * @param title The title of the popup.
   * @returns The active toast message object.
   */
  warning(message: string): MatSnackBarRef<PopupComponent> {
    return this.open(message, 'warning', null, { panelClass: ['app-snackbar', 'app-snackbar--warning', 'pointer'] });
  }

  /**
   * Shows a ERROR toast message with the given message and
   * title of the popup.
   *
   * @param message The message to display.
   * @returns The active toast message object.
   */
  error(message: string): MatSnackBarRef<PopupComponent> {
    return this.open(message, 'error', null, { panelClass: ['app-snackbar', 'app-snackbar--danger', 'pointer'] });
  }

  errorBottom(message: string): MatSnackBarRef<PopupComponent> {
    const defaultSettings: MatSnackBarConfig = {
      panelClass: ['app-snackbar', 'app-snackbar--danger', 'pointer'],
      horizontalPosition: 'center',
      verticalPosition: this.BOTTOM,
      duration: this.DURATION,
      data: {
        disableContainerClick: true,
        showCloseIcon: false,
        invertCloseIcon: true,
        message: message,
        prefixIcon: 'error',
      },
    };
    return this.snackBar.openFromComponent(PopupComponent, defaultSettings);
  }

  /**
   * Shows a DEFAULT toast message with the given message and
   * title of the popup.
   *
   * @param message The message to display.
   * @returns The active toast message object.
   */
  default(message: string): MatSnackBarRef<PopupComponent> {
    return this.open(message, 'info', null, { panelClass: ['app-snackbar', 'app-snackbar--default', 'pointer'] });
  }

  /**
   * Shows a DEFAULT toast message with the given message and
   * title of the popup.
   *
   * @param message The message to display.
   * @returns The active toast message object.
   */
  appUpdate(): MatSnackBarRef<PopupComponent> {
    const defaultSettings: MatSnackBarConfig = {
      panelClass: ['app-snackbar', 'app-snackbar--default', 'pointer'],
      horizontalPosition: 'center',
      verticalPosition: this.VERTICAL,
      duration: 5000,
      data: {
        prefixIcon: 'info',
        message: 'A new version of the app is available! Click the profile icon in the top right to update the app.',
      },
    };

    return this.snackBar.openFromComponent(PopupComponent, defaultSettings);
  }

  showBottomMessage(message: string, duration = 0): MatSnackBarRef<PopupComponent> {
    const defaultSettings: MatSnackBarConfig = {
      panelClass: ['app-snackbar', 'app-snackbar--default'],
      horizontalPosition: 'center',
      verticalPosition: this.BOTTOM,
      duration: duration,
      data: {
        disableContainerClick: true,
        message: message,
      },
    };
    return this.snackBar.openFromComponent(PopupComponent, defaultSettings);
  }
}

import { Component } from '@angular/core';


import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { ActionBarComponent } from '../../core/button/action-bar/action-bar.component';
import { ButtonModule } from '../../core/button/button.module';
import { IconModule } from '../../core/icon/icon.module';
import { BaseDialogComponent } from './dialog-base.component';

@Component({
  selector: 'app-basic-dialog',
  templateUrl: 'basic-dialog.component.html',
  imports: [MatDialogModule, IconModule, MatProgressSpinnerModule, ButtonModule, ActionBarComponent],
})
export class BasicDialogComponent extends BaseDialogComponent {
  private readonly actionLeft$ = new Subject<void>();
  private readonly actionRight$ = new Subject<void>();

  constructor() {
    super();
  }

  protected onActionLeftClick() {
    this.actionLeft$.next();
  }

  protected onActionRightClick() {
    this.actionRight$.next();
  }

  /**
   * Triggers when the action left click of the dialog is clicked
   *
   * @returns The action left observable
   */
  onActionLeft() {
    return this.actionLeft$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }

  /**
   * Triggers when the action right click of the dialog is clicked
   *
   * @returns  The action right observable
   */
  onActionRight() {
    return this.actionRight$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}

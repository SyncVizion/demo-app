import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';
import { ButtonComponent } from './button.component';
import { GridIconButtonComponent } from './grid-icon-button/grid-icon-button.component';

@NgModule({
  imports: [ButtonComponent, ButtonIconComponent, GridIconButtonComponent, ActionBarComponent, MatButtonModule],
  exports: [ButtonComponent, ButtonIconComponent, GridIconButtonComponent, ActionBarComponent, MatButtonModule],
})
export class ButtonModule {}

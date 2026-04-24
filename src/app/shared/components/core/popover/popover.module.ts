import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopoverPanelContentComponent } from './content/popover-content.component';
import { PopoverPanelHeaderComponent } from './header/popover-header.component';
import { PopoverPanelComponent } from './popover.component';
import { PopoverTriggerForDirective } from './popover.directive';

@NgModule({
  imports: [
    PopoverPanelComponent,
    PopoverTriggerForDirective,
    PopoverPanelHeaderComponent,
    PopoverPanelContentComponent,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
  ],
  exports: [
    PopoverPanelComponent,
    PopoverTriggerForDirective,
    PopoverPanelHeaderComponent,
    PopoverPanelContentComponent,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
  ],
})
export class PopoverModule {}

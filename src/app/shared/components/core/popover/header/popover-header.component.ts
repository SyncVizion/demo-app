import { Component, contentChildren, inject, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopoverPanelComponent } from '../popover.component';

@Component({
  selector: 'app-popover-panel-header',
  template: `
    <div class="app-popover__header__icons">
      @if (buttonIcons().length > 0) {
        <ng-content select="button[mat-icon-button]"></ng-content>
      }

      <button
        mat-icon-button
        class="ml-sm"
        matTooltip="Close"
        (click)="popover.close()"
        (keydown.enter)="popover.close()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <ng-content></ng-content>

    @if (title()) {
      <div class="app-popover__header__title">
        {{ title() }}
      </div>
    }
  `,
  host: { class: 'app-popover__header' },
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class PopoverPanelHeaderComponent {
  title = input<string>();
  buttonIcons = contentChildren(MatIconButton);
  popover = inject(PopoverPanelComponent, { host: true });
}

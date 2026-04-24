import { booleanAttribute, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

/**
 * Grid Button component
 */
@Component({
  selector: 'app-grid-icon-button',
  template: `
    <button mat-icon-button [disabled]="disabled()" [matTooltip]="tooltip()" [matTooltipPosition]="tooltipPosition()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
  host: {
    class: 'app-grid-icon-btn',
    '[class.pointer-events-none]': 'disabled()',
  },
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class GridIconButtonComponent {
  tooltip = input<string>();
  tooltipPosition = input<TooltipPosition>('left');
  disabled = input(false, { transform: booleanAttribute });
  icon = input.required<string>();
}

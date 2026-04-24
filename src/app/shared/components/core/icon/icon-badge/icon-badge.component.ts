import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type BadgeIconColor = 'primary' | 'warning' | 'danger' | 'neutral';
export type BadgeIconSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-badge-icon',
  templateUrl: './icon-badge.component.html',
  host: { class: 'badge-container' },
  imports: [MatIconModule, MatTooltipModule, CommonModule],
})
export class BadgeIconComponent {
  icon = input.required<string>();
  color = input<BadgeIconColor>('primary');
  size = input<BadgeIconSize>('large');
  tooltip = input<string>('');
  tooltipPosition = input<string>('above');
}

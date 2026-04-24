import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, contentChildren, inject, input } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Prefix, Suffix } from '../../icon/icon.component';
import { CardComponent } from '../card.component';

/**
 * Header region of a card, intended for use within `<app-card>`. This header captures
 * a card title and any other complex header content.
 */
@Component({
  selector: 'app-card-header, [app-card-header]',
  templateUrl: 'card-header.component.html',
  host: {
    class: 'card__header',
    '[class.card__header--default]': '!appCard.collapsible()',
    '[class.card__header--collapsible]': 'appCard.collapsible()',
    '[class.card__header--closed]': '!appCard.expanded',
    '[class.mb-md]': '!!appCard.grid()',
    '[class.card__header__border-bottom]': 'bottomBorder()',
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
  },
  imports: [CommonModule, MatBadgeModule, MatTooltipModule, MatIconModule],
})
export class CardHeaderComponent {
  title = input();
  appCard = inject(CardComponent, { host: true });
  bottomBorder = input(true, { transform: booleanAttribute });
  error = input(false);
  errorMessage = input('Card has error!');

  appLeftIcons = contentChildren(Prefix);
  appRightIcons = contentChildren(Suffix);

  toggle() {
    this.appCard.toggleContent();
  }
}

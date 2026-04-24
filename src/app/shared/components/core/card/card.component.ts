import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';

import { booleanAttribute, Component, computed, contentChild, input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GridComponent } from '../grid/grid.component';
import { CardContentComponent } from './card-content/card-content.directive';
import { CardHeaderComponent } from './card-header/card-header.component';

/**
 *  card component. Cards contain content and actions about a single subject.
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  host: {
    class: 'card',
    '[class.pt-lg]': '!cardHeaderPresent()',
    '[class.disabled]': 'disabled',
    '[class.card__content--no-padding]': '!!grid() || !padding()',
  },
  imports: [CardContentComponent, CdkAccordionModule, MatProgressSpinnerModule],
})
export class CardComponent extends CdkAccordionItem implements OnInit {
  collapsible = input(false, { transform: booleanAttribute });
  collapsed = input(false, { transform: booleanAttribute });
  loading = input(false);
  cardHeader = contentChild(CardHeaderComponent);
  grid = contentChild(GridComponent);
  padding = input(true, { transform: booleanAttribute });
  cardHeaderPresent = computed(() => !!this.cardHeader());
  firstLoad = true;

  ngOnInit() {
    this.expanded = !this.collapsed();
  }

  toggleContent() {
    if (this.collapsible()) {
      if (this.firstLoad) this.firstLoad = false;
      this.toggle();
    }
  }

  open() {
    if (this.collapsible()) {
      this.expanded = true;
    }
  }

  close() {
    if (this.collapsible()) {
      this.expanded = false;
    }
  }
}

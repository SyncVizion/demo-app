import { booleanAttribute, Component, input, output } from '@angular/core';
import { IconModule } from '../icon/icon.module';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  host: {
    class: 'chip',
    '[class.chip--selected]': 'selected()',
    tabindex: '0',
  },
  imports: [IconModule],
})
export class ChipComponent {
  index = input<number>();
  removeable = input(false, { transform: booleanAttribute });
  removed = output<number>();
  selected = input(false);

  /**
   * Remove this input tag.
   */
  removeTag(): void {
    this.removed.emit(this.index());
  }
}

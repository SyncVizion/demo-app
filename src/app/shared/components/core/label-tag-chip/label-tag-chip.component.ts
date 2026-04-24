import { Component, computed, input } from '@angular/core';
import { LabelTag } from 'src/app/shared/models/label-tag.model';

@Component({
  selector: 'app-label-tag-chip',
  template: '{{compName()}}',
  host: {
    class: 'label-tag__type no-wrap',
    '[style.color]': 'compColor()',
    '[style.border]': "'1px solid ' + compColor()",
    '[style.background-color]': "compColor() + '1a'",
  },
})
export class LabelTagChipComponent {
  tag = input<LabelTag>();
  name = input<string>('No Status');
  color = input<string>('#607d8b');

  compName = computed(() => (this.tag() ? this.tag().name : this.name()));
  compColor = computed(() => (this.tag() ? this.tag().color : this.color()));
}

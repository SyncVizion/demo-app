import { booleanAttribute, contentChild, Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'app-grid-column',
})
export class GridColumnComponent {
  label = input<string>();
  field = input<string>();
  ignoreClick = input(false, { transform: booleanAttribute });
  sortable = input(false, { transform: booleanAttribute });
  templateRef = contentChild(TemplateRef);
}

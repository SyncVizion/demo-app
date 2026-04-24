import { Component } from '@angular/core';

@Component({
  selector: 'app-popover-panel-content',
  template: `<ng-content></ng-content> `,
  host: { class: 'app-popover__content' },
})
export class PopoverPanelContentComponent {}

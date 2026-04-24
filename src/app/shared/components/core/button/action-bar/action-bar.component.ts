import { Component, input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: 'action-bar.component.html',
  host: {
    class: 'action-bar__container',
  },
})
export class ActionBarComponent {
  title = input<string>();
}

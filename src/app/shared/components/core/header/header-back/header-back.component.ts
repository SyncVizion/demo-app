import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header-back',
  templateUrl: 'header-back.component.html',
  host: {
    class: 'header-back',
  },
  imports: [MatIconModule],
})
export class HeaderBackComponent {}

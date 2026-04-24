import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '../../button/button.module';
import { IconModule } from '../../icon/icon.module';
import { PopoverModule } from '../../popover/popover.module';

@Component({
  selector: 'app-header-drop-menu',
  templateUrl: 'header-drop-menu.component.html',
  imports: [MatIconModule, ButtonModule, PopoverModule, IconModule],
})
export class HeaderDropMenuComponent {
  position = input('bottom');
  backgroundColor = input('white');
  title = input('');
}

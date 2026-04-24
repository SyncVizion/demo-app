import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, contentChildren, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  imports: [MatIconModule, MatButtonModule, CommonModule],
})
export class HeaderComponent {
  buttons = contentChildren(ButtonComponent);
  title = input.required();
  center = input(false);
  fullWidth = input(false, { transform: booleanAttribute });
  dropMenu = input(false, { transform: booleanAttribute });
}

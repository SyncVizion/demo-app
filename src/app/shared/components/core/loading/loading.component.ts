import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  imports: [CommonModule],
})
export class LoadingComponent {
  size = input('100px');
  thickness = input('4px');
  type = input<'default' | 'ellipsis' | 'double'>('default');
  backgroundColor = input('#F1F5F9');
  margin = input<string>(undefined);
}

import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ElementTypeDefinition } from '../../models/dynamic-builder.model';

@Component({
  selector: 'app-element-drag-chip',
  templateUrl: './element-drag-chip.component.html',
  imports: [MatIconModule, DragDropModule],
  styleUrls: ['./element-drag-chip.component.scss'],
})
export class ElementDragChipComponent {
  elementType = input.required<ElementTypeDefinition>();
  whileDragging = signal(false);
}

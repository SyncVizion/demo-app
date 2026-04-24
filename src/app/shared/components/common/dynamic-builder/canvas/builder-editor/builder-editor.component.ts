import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditorElement } from '../../models/dynamic-builder.model';
import { EditorCanvasService } from '../../services/editor-canvas.service';
import { ElementFieldComponent } from '../element-field/element-field.component';

@Component({
  selector: 'app-builder-editor',
  templateUrl: './builder-editor.component.html',
  imports: [DragDropModule, ElementFieldComponent, MatButtonModule, MatIconModule],
  styleUrls: ['./builder-editor.component.scss'],
})
export class BuilderEditorComponent {
  dropCondition = input<() => boolean>(() => true);
  newElementBuilder = input<(drag: CdkDragDrop<string>) => EditorElement>(() => null);
  defaultDropCondition = () => true;
  editorCanvasService = inject(EditorCanvasService);

  onDropInRow(event: CdkDragDrop<string>, rowId: string) {
    if (event.previousContainer.data === 'menu-selector') {
      const newElement: EditorElement = this.buildNewElement(event);
      this.editorCanvasService.addElement(newElement, rowId, event.currentIndex);
      return;
    }

    const dragData = event.item.data;
    const previousRowId = event.previousContainer.data;

    this.editorCanvasService.moveElement(dragData.id, previousRowId, rowId, event.currentIndex);
  }

  private buildNewElement(drag: CdkDragDrop<string>): EditorElement {
    const newElement: EditorElement = this.newElementBuilder()(drag);
    return { id: crypto.randomUUID(), ...newElement };
  }
}

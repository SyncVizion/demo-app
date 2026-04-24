import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditorCanvasService } from '../../services/editor-canvas.service';
import { ElementPreviewComponent } from '../element-preview/element-preview.component';

@Component({
  selector: 'app-element-field',
  templateUrl: './element-field.component.html',
  imports: [CommonModule, TitleCasePipe, MatButtonModule, MatIconModule, ElementPreviewComponent],
  styleUrls: ['./element-field.component.scss'],
})
export class ElementFieldComponent {
  element = input.required<any>();
  editorCanvasService = inject(EditorCanvasService);

  deleteField(e: Event) {
    e.stopPropagation();
    this.editorCanvasService.deleteElement(this.element().id);
  }
}

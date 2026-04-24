import { Component, inject } from '@angular/core';
import { EditorCanvasService } from '../../services/editor-canvas.service';
import { ElementPreviewComponent } from '../element-preview/element-preview.component';

@Component({
  selector: 'app-builder-preview',
  templateUrl: './builder-preview.component.html',
  imports: [ElementPreviewComponent],
  styleUrls: ['./builder-preview.component.scss'],
})
export class BuilderPreviewComponent {
  editorCanvasService = inject(EditorCanvasService);
}

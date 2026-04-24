import { Component, inject, input, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '../../../core/button/button.module';
import { EditorElement } from '../models/dynamic-builder.model';
import { EditorCanvasService } from '../services/editor-canvas.service';
import { BuilderEditorComponent } from './builder-editor/builder-editor.component';
import { BuilderPreviewComponent } from './builder-preview/builder-preview.component';

@Component({
  selector: 'app-builder-canvas',
  templateUrl: './builder-canvas.component.html',
  imports: [BuilderEditorComponent, BuilderPreviewComponent, ButtonModule, MatButtonToggleModule, MatIconModule],
  styleUrls: ['./builder-canvas.component.scss'],
})
export class BuilderCanvasComponent {
  title = input.required<string>();
  dropCondition = input<() => boolean>(() => true);
  newElementBuilder = input<(drag: CdkDragDrop<string>) => EditorElement>(() => null);
  hidePreview = input<boolean>(false);
  activeTab = signal<'preview' | 'editor'>('editor');
  editorCanvasService = inject(EditorCanvasService);
}

import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditorCanvasService } from '../services/editor-canvas.service';
import { ElementTypesService } from '../services/element-types.service';
import { DynamicOptionsComponent } from './dynamic-options/dynamic-options.component';

@Component({
  selector: 'app-element-field-settings',
  templateUrl: './element-field-settings.component.html',
  imports: [MatFormFieldModule, MatInput, FormsModule, MatCheckboxModule, MatSelectModule, DynamicOptionsComponent],
  styleUrls: ['./element-field-settings.component.scss'],
})
export class ElementFieldSettingsComponent {
  title = input.required<string>();
  editorCanvasService = inject(EditorCanvasService);
  elementTypesService = inject(ElementTypesService);

  elementSettings = computed<any[]>(() => {
    const element = this.editorCanvasService.selectedElement();
    if (!element) {
      return [];
    }

    const fieldDef = this.elementTypesService.getElementType(element.type);
    return fieldDef?.settingsConfig ?? [];
  });

  elementValues = computed<any>(() => {
    const element = this.editorCanvasService.selectedElement();
    if (!element) {
      return {};
    }

    return element;
  });

  updateField(fieldId: string, key: string, value: any) {
    this.editorCanvasService.updateElement(fieldId, { [key]: value });
  }
}

import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EditorElement, ElementTypeDefinition } from '../../models/dynamic-builder.model';
import { ElementTypesService } from '../../services/element-types.service';

@Component({
  selector: 'app-element-preview',
  templateUrl: './element-preview.component.html',
  imports: [NgComponentOutlet],
})
export class ElementPreviewComponent<D extends ElementTypeDefinition, E extends EditorElement> {
  element = input.required<E>();
  elementTypesService = inject(ElementTypesService<D>);

  previewComponent = computed(() => {
    const type = this.elementTypesService.getElementType(this.element().type);
    return type?.component ?? null;
  });
}

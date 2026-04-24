import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { TabRoutingManagerModule } from '../../tab-routing-manager/tab-routing-manager.module';
import { ElementTypeDefinition } from '../models/dynamic-builder.model';
import { ElementTypesService } from '../services/element-types.service';
import { ElementDragChipComponent } from './element-drag-chip/element-drag-chip.component';

@Component({
  selector: 'app-builder-elements-menu',
  templateUrl: './builder-elements-menu.component.html',
  imports: [ElementDragChipComponent, DragDropModule, TabRoutingManagerModule],
  styleUrls: ['./builder-elements-menu.component.scss'],
})
export class BuilderElementsMenuComponent<D extends ElementTypeDefinition> {
  tabs = input(false);
  title = input.required<string>();
  elementTypesService = inject(ElementTypesService<D>);
  elementTypes = this.elementTypesService.getAllElementTypes();
  tabGroups = this.elementTypesService.getAllTabGroups();

  noDropAllowed = () => false;
}

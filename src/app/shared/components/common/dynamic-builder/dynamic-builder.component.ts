import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '../../core/button/button.module';
import { HeaderModule } from '../../core/header/header.module';
import { BuilderCanvasComponent } from './canvas/builder-canvas.component';
import { BuilderElementsMenuComponent } from './menu/builder-elements-menu.component';
import { DynamicBuilderConfig } from './models/dynamic-builder.model';
import { ElementFieldSettingsComponent } from './settings/element-field-settings.component';

@Component({
  selector: 'app-dynamic-builder',
  templateUrl: './dynamic-builder.component.html',
  imports: [
    HeaderModule,
    BuilderElementsMenuComponent,
    BuilderCanvasComponent,
    ElementFieldSettingsComponent,
    DragDropModule,
    MatIconModule,
    ButtonModule,
  ],
  styleUrls: ['./dynamic-builder.component.scss'],
})
export class DynamicBuilderComponent {
  config = input<DynamicBuilderConfig>({
    menu: { title: 'Menu' },
    canvas: { title: 'Canvas' },
    settings: { title: 'Settings' },
  });
}

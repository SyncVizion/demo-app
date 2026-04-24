import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Type } from '@angular/core';

export interface DynamicBuilderConfig {
  menu?: { title?: string; disabled?: boolean };
  canvas?: {
    title?: string;
    rowDropCondition?: (drag: CdkDrag, drop: CdkDropList) => boolean;
    newElementBuilder?: (drag: CdkDragDrop<string>) => EditorElement;
    disabled?: boolean;
    hidePreview?: boolean;
  };
  settings?: { title?: string; disabled?: boolean };
}

export type SettingsType = 'text' | 'textarea' | 'checkbox' | 'select' | 'dynamic-options';
export interface ElementSettingsDefinition {
  type: SettingsType;
  key: string;
  label: string;
  options?: ElementOptionItem[];
}

export interface ElementOptionItem {
  label: string;
  value: string;
}

export interface ElementTypeDefinition {
  type: string;
  label: string;
  component: Type<unknown>;
  name?: string;
  icon?: string;
  defaultConfig?: any;
  settingsConfig?: ElementSettingsDefinition[];
  data?: any;
}

export interface EditorRow<T extends EditorElement> {
  id: string;
  elements: T[];
}

export interface EditorElement {
  id: string;
  type?: string;
  label?: string;
  definition?: any;
}

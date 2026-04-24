import { Type } from '@angular/core';
import {
  EditorElement,
  ElementOptionItem,
  ElementSettingsDefinition,
  ElementTypeDefinition,
} from './dynamic-builder.model';

export interface FormField extends EditorElement {
  required: boolean;
  inputType?: string;
  placeholder?: string;
  maxLength?: any;
  cdkAutosizeMinRows?: number;
  cdkAutosizeMaxRows?: number;
  options?: ElementOptionItem[];
}

export interface FieldTypeDefinition extends ElementTypeDefinition {
  id?: string;
  type: string;
  label: string;
  icon: string;
  defaultConfig: any;
  settingsConfig: ElementSettingsDefinition[];
  component: Type<unknown>;
  disabled?: boolean;
}

export interface RequestedForm {
  id: number;
  name: string;
  description: string;
  jsonForm: string;
  insertDate: Date | string;
}

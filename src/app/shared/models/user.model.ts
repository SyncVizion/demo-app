import { LabelTagType } from './label-tag.model';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  theme?: AppTheme;
}

export enum AppTheme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface Role {
  id?: number;
  name?: string;
  key?: string;
  type?: LabelTagType;
  color?: string;
  accessible?: boolean;
  [key: string]: any;
}

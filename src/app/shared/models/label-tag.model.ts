export interface LabelTag {
  id?: number;
  name?: string;
  key?: string;
  type?: LabelTagType;
  color?: string;
}

export enum LabelTagType {
  CONDITION = 'CONDITION',
}

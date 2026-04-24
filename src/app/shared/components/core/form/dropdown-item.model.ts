/**
 * A model interface for an item in a dropdown. Could be used in basic, checklist, or select style dropdowns.
 */
export interface DropdownItem {
  name: string;
  value?: any;
  color?: string;
  selected?: boolean;
  [x: string]: any; // indexer allows additional properties to be set
}

import { Injectable } from '@angular/core';
import { ElementTypeDefinition } from '../models/dynamic-builder.model';

@Injectable({
  providedIn: 'root',
})
export class ElementTypesService<T extends ElementTypeDefinition> {
  elementTypes: Map<string, T>;
  tabGroups: [{ name: string; elementTypes: Map<string, T> }];

  setTabGroup(name: string, types: Map<string, T>): void {
    if (!this.tabGroups) {
      this.tabGroups = [{ name: name, elementTypes: new Map<string, T>(types) }];
    } else {
      this.tabGroups.push({ name: name, elementTypes: new Map<string, T>(types) });
    }
  }

  /**
   * Sets the element type definitions.
   *
   * @param types A map of element type definitions where the key is the type and the value is the definition.
   */
  setElementTypes(types: Map<string, T>): void {
    this.elementTypes = new Map<string, T>(types);
  }

  /**
   * Gets the element type definition by type.
   *
   * @param type The type of the element.
   * @returns The element type definition or undefined if not found.
   */
  getElementType(type: string): T | undefined {
    return this.elementTypes.get(type);
  }

  /**
   * Gets all element types.
   *
   * @returns An array of all element type definitions.
   */
  getAllTabGroups(): T[] {
    let res = [];
    if (this.tabGroups) {
      this.tabGroups.forEach((group) => {
        res.push({
          name: group.name,
          elementTypes: Array.from(group.elementTypes.values()),
        });
      });
      return res;
    }
    return [];
  }

  /**
   * Gets all element types.
   *
   * @returns An array of all element type definitions.
   */
  getAllElementTypes(): T[] {
    return this.elementTypes ? Array.from(this.elementTypes.values()) : [];
  }
}

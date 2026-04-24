import { ApplicationRef, computed, inject, Injectable, signal } from '@angular/core';
import { EditorElement } from '../models/dynamic-builder.model';
import { startViewTransition } from '../utils/view.transition';

@Injectable({
  providedIn: 'root',
})
export class EditorCanvasService {
  protected readonly _rows = signal<any[]>([]);
  protected readonly _selectedElementId = signal<string | null>(null);
  public readonly rows = this._rows.asReadonly();

  protected readonly applicationRef = inject(ApplicationRef);

  readonly selectedElement = computed(() =>
    this._rows()
      .flatMap((row) => row?.elements)
      .find((f) => f?.id === this._selectedElementId()),
  );

  constructor() {
    this.reset();
  }

  /**
   * Sets the rows
   *
   * @param rows The rows to set.
   */
  setRows(rows: any[]) {
    this._rows.set([...rows]);
  }

  /**
   * Resets the editor to its initial state.
   */
  reset() {
    this._rows.set([
      {
        id: crypto.randomUUID(),
        elements: [],
      },
    ]);
  }

  /**
   * Adds a new element to the editor.
   *
   * @param element The editor element to add.
   * @param rowId The id of the row to which the element will be added.
   * @param index The index at which to insert the element. If not provided, the element will be appended to the end of the row.
   */
  addElement(element: EditorElement, rowId: string, index?: number) {
    const rows = this._rows();
    const newRows = rows.map((row) => {
      if (row.id === rowId) {
        const updatedElements = [...row.elements];
        if (index !== undefined) {
          updatedElements.splice(index, 0, element);
        } else {
          updatedElements.push(element);
        }
        return { ...row, elements: updatedElements };
      }
      return row;
    });

    startViewTransition(() => this._rows.set(newRows));
  }

  /**
   * Deletes a element from the form builder.
   *
   * @param elementId The id of the element to delete.
   */
  deleteElement(elementId: string) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      elements: row.elements.filter((el) => el.id !== elementId),
    }));

    startViewTransition(() => {
      this._rows.set(newRows);
      this.applicationRef.tick();
    });
  }

  addHeaderRow() {
    const hRow = {
      id: crypto.randomUUID(),
      isHeader: true,
      topLeftElement: null,
      topRightElement: null,
      title: null,
    };

    const rows = this._rows();
    startViewTransition(() => this._rows.set([...rows, hRow]));
  }

  /**
   * Adds a new row to the form builder.
   */
  addRow() {
    const newRow = {
      id: crypto.randomUUID(),
      elements: [],
    };

    const rows = this._rows();
    startViewTransition(() => this._rows.set([...rows, newRow]));
  }

  /**
   * Deletes a row from the form builder.
   *
   * @param rowId The id of the row to delete.
   */
  deleteRow(rowId: string) {
    if (this._rows().length === 1) {
      return;
    }

    const rows = this._rows();
    const newRows = rows.filter((row) => row.id !== rowId);
    startViewTransition(() => this._rows.set(newRows));
  }

  /**
   * Moves a element from one row to another or between elements in the same row.
   *
   * @param elementId The id of the element to move.
   * @param sourceRowId The id of the row from which to move the element.
   * @param targetRowId The id of the row to which to move the element.
   * @param targetIndex The index at which to insert the element in the target row. If -1, it will be appended to the end.
   */
  moveElement(elementId: any, sourceRowId: any, targetRowId: any, targetIndex: number = -1) {
    startViewTransition(() => {
      const rows = this._rows();
      let elementToMove: any;
      let sourceRowIndex = -1;
      let sourceElementIndex = -1;

      rows.forEach((row, rowIndex) => {
        if (row.id === sourceRowId) {
          sourceRowIndex = rowIndex;
          sourceElementIndex = row.elements.findIndex((f) => f.id === elementId);
          if (sourceElementIndex >= 0) {
            elementToMove = row.elements[sourceElementIndex];
          }
        }
      });

      if (!elementToMove) {
        return;
      }

      const newRows = [...rows];
      const elementsWithRemoveElement = newRows[sourceRowIndex].elements.filter((f, index) => f.id !== elementId);
      newRows[sourceRowIndex].elements = elementsWithRemoveElement;

      const targetRowIndex = newRows.findIndex((r) => r.id === targetRowId);
      if (targetRowIndex >= 0) {
        const targetElements = [...newRows[targetRowIndex].elements];
        targetElements.splice(targetIndex, 0, elementToMove);
        newRows[targetRowIndex].elements = targetElements;
      }

      this._rows.set(newRows);
      this.applicationRef.tick();
    });
  }

  /**
   * Sets the selected element id.
   *
   * @param elementId The id of the element to select.
   */
  setSelectedElement(elementId: string) {
    this._selectedElementId.set(elementId);
  }

  /**
   * Updates the element with the given id with the provided data.
   *
   * @param elementId The id of the element to update.
   * @param data The data to update the element with.
   */
  updateElement(elementId: string, data: Partial<any>) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      elements: row.elements.map((f) => (f.id === elementId ? { ...f, ...data } : f)),
    }));
    this._rows.set(newRows);
  }

  /**
   * Moves the given row id up in the form builder.
   *
   * @param rowId The id of the row to move up.
   */
  moveRowUp(rowId: string) {
    const rows = this._rows();
    const rowIndex = rows.findIndex((r) => r.id === rowId);

    if (rowIndex > 0) {
      const newRows = [...rows];
      const temp = newRows[rowIndex - 1];
      newRows[rowIndex - 1] = newRows[rowIndex];
      newRows[rowIndex] = temp;

      startViewTransition(() => this._rows.set(newRows));
    }
  }

  /**
   * Moves the given row id down in the form builder.
   *
   * @param rowId The id of the row to move down.
   */
  moveRowDown(rowId: string) {
    const rows = this._rows();
    const rowIndex = rows.findIndex((r) => r.id === rowId);

    if (rowIndex < rows.length - 1) {
      const newRows = [...rows];
      const temp = newRows[rowIndex + 1];
      newRows[rowIndex + 1] = newRows[rowIndex];
      newRows[rowIndex] = temp;

      startViewTransition(() => this._rows.set(newRows));
    }
  }
}

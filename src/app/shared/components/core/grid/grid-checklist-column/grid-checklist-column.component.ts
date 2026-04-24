import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { Directive, effect, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GridChecklistChange } from './grid-checklist.model';

@Directive({
  selector: 'app-grid-checklist-column',
})
export class GridChecklistColumnComponent {
  selected = input<any[]>([]);
  idField = input<string>('id');
  checkboxChange = output<GridChecklistChange>();

  readonly selections = new SelectionModel<any>(true, [], true, (o1, o2) => o1[this.idField()] === o2[this.idField()]);

  private readonly selectionSignal = toSignal(this.selections.changed);
  private isSelectionTypeObject = false;

  constructor() {
    effect(() => this.listenToInputChanges(this.selected()));
    effect(() => this.listenToSelectionChanges(this.selectionSignal()));
  }

  /**
   * Listens to changes in the selected input and updates the selection model accordingly.
   *
   * @param selectedInput The input array that may contain either IDs or objects.
   */
  listenToInputChanges(selectedInput: any[]) {
    this.isSelectionTypeObject = this.isArrayOfObjects(selectedInput);

    if (this.isSelectionTypeObject) {
      this.selections.select(...selectedInput);
    } else {
      this.selections.select(...selectedInput.map((s) => ({ [this.idField()]: s })));
    }
  }

  /**
   * Listens to changes in the selection model and emits a change event.
   *
   * @param selectChange The selection change event containing added and removed items.
   */
  listenToSelectionChanges(selectChange: SelectionChange<any>) {
    const addedIds = selectChange?.added?.map((s) => s[this.idField()]) ?? [];
    const removedIds = selectChange?.removed?.map((s) => s[this.idField()]) ?? [];

    const changeEvent: GridChecklistChange = {
      added: addedIds,
      removed: removedIds,
      selectedIds: this.selections?.selected?.map((s) => s[this.idField()]) ?? [],
      selected: this.selections.selected ?? [],
    };

    this.checkboxChange.emit(changeEvent);
  }

  /**
   * Toggles the selection of a row element.
   *
   * @param rowElement The row element to toggle selection for.
   */
  onToggleSelection(rowElement: any) {
    this.selections.toggle(rowElement);
  }

  /**
   * Determines if the provided value is an array of objects.
   *
   * @param value The value to check.
   * @returns `true` if the value is an array of objects, `false` otherwise.
   */
  private isArrayOfObjects(value: any): boolean {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
    );
  }
}

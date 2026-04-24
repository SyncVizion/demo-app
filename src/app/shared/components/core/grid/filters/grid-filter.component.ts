import { DomPortal } from '@angular/cdk/portal';
import { Component, ElementRef, Injector, input, InputSignal, OnInit } from '@angular/core';
import { GridFilterBarComponent } from './bar/grid-filter-bar.component';

@Component({
  template: '',
})
export abstract class GridFilterComponent implements OnInit {
  fill = input(false);
  element: ElementRef;
  portal: DomPortal<any>;
  filterBar: GridFilterBarComponent;

  constructor(protected injector: Injector) {}

  abstract get key(): InputSignal<string>;
  abstract get value(): any[];
  abstract set value(newValue: any);

  ngOnInit(): void {
    this.element = this.injector.get(ElementRef);
    this.filterBar = this.injector.get(GridFilterBarComponent);
    this.portal = new DomPortal(this.element);
  }

  /**
   * Gets the host element of the component.
   */
  getComponentElement(): ElementRef<any> {
    return this.element;
  }

  /**
   * Notifies the grid header bar that the filter has changed.
   */
  notifyChange() {
    this.filterBar.notifyChange();
  }
}

import { DomPortal } from '@angular/cdk/portal';
import { booleanAttribute, Component, ElementRef, Injector, input, OnInit, inject } from '@angular/core';

@Component({
  template: '<ng-content></ng-content>',
  selector: 'app-tab-route',
})
export class TabRouteComponent implements OnInit {
  protected injector = inject(Injector);

  label = input<string>('label');
  disabled = input(false, { transform: booleanAttribute });
  tooltip = input<string>();

  element: ElementRef;
  portal: DomPortal<any>;

  ngOnInit(): void {
    this.element = this.injector.get(ElementRef);
    this.portal = new DomPortal(this.element);
  }
}

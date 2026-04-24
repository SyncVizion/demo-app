import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, contentChild, ElementRef, inject, input, output, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-popover-panel',
  template: `
    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayBackdropClass="app-popover__backdrop"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayPositions]="resolvedPositions"
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayPush]="true"
      [cdkConnectedOverlayPanelClass]="['app-popover__container', 'app-popover--' + position()]"
      [cdkConnectedOverlayWidth]="width()"
      [cdkConnectedOverlayHeight]="'auto'"
      [cdkConnectedOverlayViewportMargin]="smallScreen ? 0 : 16"
      (overlayOutsideClick)="close()"
    >
      <div class="d-flex flex-column w-100" [class.open]="openClass">
        <ng-template [ngTemplateOutlet]="content()" [ngTemplateOutletContext]="{ $implicit: data }"></ng-template>
      </div>
    </ng-template>
  `,
  imports: [CommonModule, OverlayModule],
  exportAs: 'appPopoverPanel',
})
export class PopoverPanelComponent {
  overlay = viewChild(CdkConnectedOverlay);
  content = contentChild(TemplateRef<unknown>);

  position = input<'top' | 'bottom' | 'left' | 'right' | 'center'>('right');
  width = input<string>('400px');
  backgroundColor = input<string>('#f1f5f9');

  closed = output<void>();
  opened = output<any>();

  breakpointObserver = inject(BreakpointObserver);

  origin: CdkOverlayOrigin | ElementRef;
  data: any;
  open = false;
  openClass = false;
  smallScreen = false;

  constructor() {
    this.breakpointObserver.observe(['(max-width: 450px)']).subscribe((result) => (this.smallScreen = result.matches));
  }

  close() {
    this.open = false;
    this.openClass = false;
  }

  get resolvedPositions(): ConnectedPosition[] {
    switch (this.position()) {
      case 'top':
        return [
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        ];
      case 'center':
        return [
          { originX: 'start', originY: 'center', overlayX: 'center', overlayY: 'bottom' },
          { originX: 'end', originY: 'center', overlayX: 'center', overlayY: 'top' },
        ];
      case 'left':
        return [
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
        ];
      case 'right':
        return [
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
        ];
      case 'bottom':
      default:
        return [
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
        ];
    }
  }
}

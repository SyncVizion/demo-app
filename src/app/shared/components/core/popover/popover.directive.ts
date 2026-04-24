import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DestroyRef, Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription } from 'rxjs';
import { PopoverPanelComponent } from './popover.component';

@Directive({
  selector: '[popoverTriggerFor]',
  providers: [CdkOverlayOrigin],
  host: { cdkOverlayOrigin: '', '(click)': 'onHostClick()' },
})
export class PopoverTriggerForDirective extends CdkOverlayOrigin {
  popoverTriggerFor = input<PopoverPanelComponent>(null);
  popoverTriggerData = input<any>(null);
  popoverTriggerOrigin = input<CdkOverlayOrigin>(null);

  private readonly destroyRef = inject(DestroyRef);
  private originClickSub?: Subscription;

  constructor() {
    super();
    effect(() => {
      this.popoverTriggerOrigin();

      if (this.popoverTriggerOrigin() && !this.originClickSub) {
        this.originClickSub = fromEvent(this.popoverTriggerOrigin().elementRef.nativeElement, 'click')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.toggle());
      }
    });
  }

  onHostClick() {
    if (!this.popoverTriggerOrigin()) {
      this.toggle();
    }
  }

  toggle() {
    this.popoverTriggerFor().origin = this.popoverTriggerOrigin() ?? this;
    this.popoverTriggerFor().data = this.popoverTriggerData();
    this.popoverTriggerFor().open = !this.popoverTriggerFor().open;

    if (this.popoverTriggerFor().open) {
      this.popoverTriggerFor().opened.emit(this.popoverTriggerData());
      setTimeout(() => (this.popoverTriggerFor().openClass = this.popoverTriggerFor().open), 10);
    } else {
      this.popoverTriggerFor().openClass = this.popoverTriggerFor().open;
      this.popoverTriggerFor().closed.emit();
    }
  }
}

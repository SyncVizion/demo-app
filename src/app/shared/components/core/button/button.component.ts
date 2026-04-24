import { BreakpointObserver } from '@angular/cdk/layout';

import { booleanAttribute, Component, computed, inject, input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonEmphasis, ButtonVariant } from './button.model';

/**
 * Button component
 */
@Component({
  selector: 'button[app-button]',
  templateUrl: 'button.component.html',
  host: {
    '[class]': 'buttonClass()',
    '[class.app-btn--icon]': 'onSmallScreen && iconOnSmallScreen',
  },
  imports: [MatIconModule, MatProgressSpinnerModule],
})
export class ButtonComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  variant = input<ButtonVariant>('subtle');
  emphasis = input<ButtonEmphasis>('primary');
  size = input<'small' | 'large'>();
  filled = input<boolean>(false);
  loading = input<boolean>(false);
  iconOnSmallScreen = input(false, { transform: booleanAttribute });

  buttonClass = computed(() => this.buildButtonClasses(this.variant(), this.emphasis()));

  onSmallScreen = true;

  /**
   * Listen for screen size changes
   */
  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 650px)'])
      .subscribe((result) => (this.onSmallScreen = result.matches));
  }

  /**
   * Builds the button classes based on the variant, emphasis, and size.
   *
   * @param variant The variant of the button
   * @param emphasis The emphasis of the button
   * @returns The classes for the button
   */
  buildButtonClasses(variant: ButtonVariant, emphasis: ButtonEmphasis) {
    let baseClass = `app-btn`;
    baseClass += ` app-btn--${variant} app-btn--${emphasis}`;
    baseClass += this.size() ? ` app-btn--${this.size()}` : '';
    baseClass += this.size() === 'small' ? ' icon-20' : '';
    return baseClass;
  }
}

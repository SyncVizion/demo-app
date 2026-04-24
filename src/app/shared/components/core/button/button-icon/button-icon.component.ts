import { booleanAttribute, Component, computed, input } from '@angular/core';
import { ButtonEmphasis, ButtonVariant } from '../button.model';

/**
 * Button Icon component
 */
@Component({
  selector: 'button[app-button-icon]',
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'buttonClass()',
  },
})
export class ButtonIconComponent {
  variant = input<ButtonVariant>('subtle');
  emphasis = input<ButtonEmphasis>('primary');
  filled = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large'>();
  loading = input<boolean>(false);

  buttonClass = computed(() => this.buildButtonClasses(this.variant(), this.emphasis()));

  /**
   * Builds the button classes based on the variant, emphasis, and size.
   *
   * @param variant The variant of the button
   * @param emphasis The emphasis of the button
   * @returns The classes for the button
   */
  buildButtonClasses(variant: ButtonVariant, emphasis: ButtonEmphasis) {
    let baseClass = `app-btn--icon app-btn app-btn--${variant} app-btn--${emphasis}`;
    baseClass += this.size() ? ` app-btn--${this.size()}` : '';
    baseClass += this.size() === 'small' ? ' icon-20' : '';

    if (this.filled()) {
      baseClass += ' app-btn--filled';
    }
    return baseClass;
  }
}

import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  Inject,
  inject,
  input,
  OnInit,
  Optional,
  output,
  Signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgModel,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ChangeMethod } from 'src/app/shared/models/common.model';
import { ChipComponent } from '../chip/chip.component';
import { InputElementBase } from './input-element-base';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'multi-select-container',
    '[class.overflow-hidden]': 'scrollable()',
    '[class.multi-select-container--focus]': 'isFocused',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostClick()',
  },
  imports: [FormsModule, ReactiveFormsModule, ChipComponent],
})
export class MultiSelectComponent extends InputElementBase<string[]> implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);

  multiselectElement = viewChild<ElementRef>('multiselectElement');
  model = viewChild(NgModel);

  readonly addOnBlur = input(true);
  readonly addOnComma = input(true);
  readonly addOnEnter = input(true);
  readonly addOnPaste = input(true);
  readonly addOnSpace = input(false);
  readonly allowDuplicates = input(false);
  readonly allowedTagsPattern = input<RegExp>(/.+/);
  readonly pasteSplitPattern = input(',');
  readonly placeholder = input('');
  readonly scrollable = input(false);

  readonly addTag = output<any>();
  readonly removeTag = output<any>();
  readonly valueChange = output<any>();
  readonly focus = output<void>();

  readonly destroyRef = inject(DestroyRef);

  readonly splitRegExp: Signal<RegExp> = computed(() => new RegExp(this.pasteSplitPattern()));

  public isFocused = false;
  public selectedTag: number;
  public multiselectForm: UntypedFormGroup;

  private get multiselectField(): AbstractControl {
    return this.multiselectForm.get('multiselectField');
  }

  private get inputValue(): string {
    return this.multiselectField.value;
  }

  constructor(
    @Optional()
    @Inject(NG_VALIDATORS)
    validators: any[],
    @Optional()
    @Inject(NG_ASYNC_VALIDATORS)
    asyncValidators: any[],
  ) {
    super(validators, asyncValidators);
    this.value = [];
  }

  /**
   * Initialize the component.
   */
  ngOnInit() {
    this.multiselectForm = this.fb.group({
      multiselectField: '',
    });
  }

  /**
   * Force focus on the input element when any part of the
   * multiselect element is clicked.
   *
   * @param event the click event
   * @param target the target element
   */
  onHostClick() {
    this.multiselectElement().nativeElement.focus();
    this.isFocused = true;
  }

  /**
   * Handle keypresses.
   *
   * @param event the keyboard event
   */
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Backspace':
        this.handleBackspace();
        break;
      case 'Enter':
        this.handleKey(event, ChangeMethod.ENTER, this.addOnEnter());
        break;
      case ',':
        this.handleKey(event, ChangeMethod.COMMA, this.addOnComma());
        break;
      case ' ':
        this.handleKey(event, ChangeMethod.SPACE, this.addOnSpace());
        break;
      default:
        break;
    }
  }

  /**
   * Determine if a key press should add a tag.
   *
   * @param event the keyboard event
   * @param method the method that triggered the key press
   * @param shouldAdd whether the key press should add a tag
   */
  private handleKey(event: KeyboardEvent, method: ChangeMethod, shouldAdd: boolean) {
    if (shouldAdd) {
      this.addTags([this.inputValue], method);
      event.preventDefault();
    }
  }

  /**
   * Handle the blur event. If the addOnBlur property is set, the item that is currently
   * being typed will be added as a tag.
   *
   * @param event the blur event
   */
  onInputBlurred(event): void {
    if (this.addOnBlur()) {
      this.addTags([this.inputValue], ChangeMethod.BLUR);
    }
    this.isFocused = false;
  }

  /**
   * Handle the focus event.
   */
  onInputFocused(event): void {
    this.isFocused = true;
    this.focus.emit();
  }

  /**
   * Handle text pasted into the input field. Will add a set of tags from the pasted value. The
   * value is split based on the pasteSplitPattern property. The default is ','.
   * @param event the paste event
   */
  onInputPaste(event: ClipboardEvent): void {
    if (this.addOnPaste()) {
      let pastedString = '';
      if (event.clipboardData?.getData) {
        pastedString = event.clipboardData.getData('text/plain');
      } else if (window['clipboardData']?.getData) {
        pastedString = window['clipboardData'].getData('Text'); // Handle IE11
      } else {
        // Browser does not support pasting
      }

      this.addTags(this.splitString(pastedString), ChangeMethod.PASTE);
      setTimeout(() => this.resetInput());
    }
  }

  /**
   * Handle clicks on a tag's x icon.
   *
   * @param tag - the removed tag
   */
  onTagRemoved(tag) {
    this.removeTagByIndex(tag, ChangeMethod.CLICK);
  }

  /**
   * Splits a string of tags on the character specified by the
   * splitRegExp property. By default tags are split on the ','
   * character.
   *
   * @param tagString - the value of the tag
   */
  private splitString(tagString: string): string[] {
    const tags = tagString.trim().split(this.splitRegExp());
    return tags.filter((tag) => !!tag);
  }

  /**
   * Checks if a tag is valid. This check includes testing the tag
   * value against the allowedTagsPattern, and validating that the tag
   * is unique or allowDuplicates is true.
   *
   * A tag is valid if:
   *
   * 1 - No allowedTagsPattern is specified and allowDuplicates is true.
   *
   * 2 - No allowedTagsPattern is specified and the tag value is not already
   * included in the tag list.
   *
   * 3 - The tag value matches the specified allowedTagsPattern and allowDuplicates is true
   *
   * 4 - The tag value matches the specified allowedTagsPattern and the tag value is not already
   * included in the tag list
   *
   * @param tagString - the string value of the tag
   */
  private isTagValid(tagString: string): boolean {
    return this.allowedTagsPattern().test(tagString) && this.isTagUnique(tagString);
  }

  /**
   * Checks if a tag is unique. If allowDuplicates is true, this will
   * return true for all values. If allowDuplicates is false, this will
   * only return true if the string is not already included in the tag list.
   * The allowDuplicates property is false by default.
   *
   * @param tagString - the string value of the tag
   */
  private isTagUnique(tagString: string): boolean {
    return this.allowDuplicates() ? true : this.value.indexOf(tagString) === -1;
  }

  /**
   * Emits the addTag event for a list of added tags. Emits
   * the event once for each tag in the list. The value
   * of the added tag is passed to the event.
   *
   * @param addedTags the list of added tags
   */
  private emitTagAdded(addedTags: string[], addedBy: ChangeMethod): void {
    if (addedTags && addedTags.length > 0) {
      addedTags.forEach((tag) => this.addTag.emit({ added: tag, method: addedBy }));
      this.emitValueChange({ value: this.value, method: addedBy });
    }
  }

  /**
   * Emits the removeTag event when a tag is removed. The value of the
   * removed tag is passed to the event.
   *
   * @param removedTag - the removed tag
   */
  private emitTagRemoved(removedTag: string, removedBy: ChangeMethod): void {
    this.removeTag.emit({ removed: removedTag, method: removedBy });
    this.emitValueChange({ value: this.value, method: removedBy });
  }

  /**
   * Emits the valueChange event. Used to notify the parent component of
   * any change to the tagList. This allows changes to be handled as a
   * group, rather than triggering an event for each added tag. This is
   * useful for handling a pasted list of tags.
   *
   * @param tags - the current value of the tagList
   */
  private emitValueChange(tags) {
    this.valueChange.emit(tags);
  }

  /**
   * Adds a list of tags to the input.
   *
   * @param tags - the list of tags to add
   * @
   */
  private addTags(tags: string[], addedBy: ChangeMethod): void {
    const validTags = tags
      .map((tag) => tag.trim())
      .filter((tag) => this.isTagValid(tag))
      .filter((tag, index, tagArray) => tagArray.indexOf(tag) === index);

    this.value = this.value.concat(validTags);
    this.resetSelected();
    this.resetInput();
    this.emitTagAdded(validTags, addedBy);
  }

  /**
   * Removes a tag from the input value.
   *
   * @param tagIndexToRemove - the index of the tag to remove
   */
  private removeTagByIndex(tagIndexToRemove: number, removedBy: ChangeMethod): void {
    const removedTag = this.value[tagIndexToRemove];
    const clone = this.value.slice(0); // Original array must be cloned or value will not update correctly
    clone.splice(tagIndexToRemove, 1);
    this.value = clone;
    this.resetSelected();
    this.emitTagRemoved(removedTag, removedBy);
  }

  /**
   * Handles keypresses on the backspace key. If this is the first press
   * it will set the last tag to selected, which will cause it to be highlighted.
   * If the backspace key is pressed again, it will remove the selected tag from the
   * tag list.
   */
  private handleBackspace(): void {
    if (!this.inputValue.length && this.value.length) {
      if (this.selectedTag !== undefined && this.selectedTag !== null) {
        this.removeTagByIndex(this.selectedTag, ChangeMethod.BACKSPACE);
      } else {
        this.selectedTag = this.value.length - 1;
      }
    }
  }

  /**
   * Resets the selected tag.
   */
  private resetSelected(): void {
    this.selectedTag = null;
  }

  /**
   * Resets the input's value.
   */
  private resetInput(): void {
    this.multiselectField.setValue('');
  }

  /**
   * Stub method for the onChange event. Part of the
   * ControlValueAccessor interface.
   */
  onChange: (value: any) => any = () => {};

  /**
   * Stub method for the onTouch event. Part of the
   * ControlValueAccessor interface.
   */
  onTouched: () => any = () => {};
}

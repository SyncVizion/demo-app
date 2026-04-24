import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { FormModule } from 'src/app/shared/components/core/form/form.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';

@Component({
  selector: 'app-cards-search',
  templateUrl: './cards-search.component.html',
  styleUrls: ['./cards-search.component.scss'],
  host: { class: 'cards-search__container' },
  imports: [IconModule, FormModule, ButtonModule],
})
export class CardsSearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  searchControl = new FormControl('');
  placeholder = input('Search');
  showFilter = input(false);
  debounce = input(750);

  searched = output<string>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce()), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onSearch(value));
  }

  onSearch(value: string) {
    this.searched.emit(value);
  }

  clear() {
    this.searchControl.setValue('');
  }
}

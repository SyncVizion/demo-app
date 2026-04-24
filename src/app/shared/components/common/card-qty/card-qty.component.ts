import { Component, DestroyRef, inject, model, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';

@Component({
  selector: 'app-card-qty',
  templateUrl: './card-qty.component.html',
  styleUrls: ['./card-qty.component.scss'],
  host: {
    class: 'd-flex align-items-center gap-1',
  },
  imports: [GridModule, HeaderModule, RouterModule, MatIconModule, CardModule, ButtonModule],
})
export class CardQtyComponent {
  private readonly destroyRef = inject(DestroyRef);

  quantity = model(0);
  changeCompleted = output<number>();
  inputQtyClicked = output<void>();

  constructor() {
    toObservable(this.quantity)
      .pipe(debounceTime(750), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.changeCompleted.emit(value));
  }

  incrementQuantity() {
    this.quantity.update((qty) => qty + 1);
  }

  decrementQuantity() {
    this.quantity.update((qty) => Math.max(0, qty - 1));
  }
}

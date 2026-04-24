import { ScrollingModule } from '@angular/cdk/scrolling';
import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { QuantityConditionDialogComponent } from 'src/app/shared/components/common/quantity-condition-dialog/quantity-condition-dialog.component';
import { VirtualCardsGridComponent } from 'src/app/shared/components/common/virtual-cards-grid/virtual-cards-grid.component';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { Collection } from 'src/app/shared/models/collection.model';
import { DialogService } from 'src/services/dialog.service';
import { CardsService } from 'src/services/pokemon/cards.service';
import { CollectionService } from 'src/services/portfolio/collection.service';
import { CardsSearchComponent } from './cards-search/cards-search.component';

@Component({
  selector: 'app-cards-grid',
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.scss',
  host: {
    class: 'overall-container',
  },
  imports: [
    CardsSearchComponent,
    GridModule,
    MatIconModule,
    HeaderModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    VirtualCardsGridComponent,
    CurrencyPipe,
  ],
})
export class CardsGridComponent {
  private readonly service = inject(CardsService);
  private readonly collectionService = inject(CollectionService);
  private readonly dialogService = inject(DialogService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);

  destroyRef = inject(DestroyRef);
  collections: Collection[];

  dataLoader: (params: any) => Observable<any>;

  constructor() {
    this.dataLoader = (params) => this.service.get(params);
    this.getCollections();
  }

  getCollections() {
    this.collectionService.getList().subscribe((collections) => {
      this.collections = collections;
    });
  }

  onRowClick(event: any) {
    this.router.navigateByUrl(`/cards/${event.id}`);
  }

  openDialog(card: any, collection: Collection) {
    const title = collection ? `Add ${card.name} to ${collection.title}` : `Add ${card.name} to Buy/Sell`;
    const quantityConditionDialog = this.dialogService.open(QuantityConditionDialogComponent, {
      data: { card: card, collection: collection, saveButtonText: 'Save', title: title },
    }).componentInstance;

    quantityConditionDialog
      .onSaved()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((res) => {
          if (collection) {
            return this.collectionService.addCard(collection.id, {
              ...card,
              condition: res.condition,
              quantity: res.quantity,
              cardType: res.cardType.id,
            });
          } else {
            console.log('Adding to buy/sell with details:', {
              ...card,
              condition: res.condition,
              quantity: res.quantity,
              cardType: res.cardType.id,
            });
            return of(null);
          }
        }),
      )
      .subscribe({
        next: () => {
          this.popupService.success('Added card successfully');
        },
        error: () => {
          this.popupService.error('Failed to add card to collection');
        },
      });
  }
}

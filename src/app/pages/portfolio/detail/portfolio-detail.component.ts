import { Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { VirtualCardsGridComponent } from 'src/app/shared/components/common/virtual-cards-grid/virtual-cards-grid.component';
import { ActionBarComponent } from 'src/app/shared/components/core/button/action-bar/action-bar.component';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { LabelTagChipComponent } from 'src/app/shared/components/core/label-tag-chip/label-tag-chip.component';
import { LoadingComponent } from 'src/app/shared/components/core/loading/loading.component';
import { PopoverPanelComponent } from 'src/app/shared/components/core/popover/popover.component';
import { PopoverModule } from 'src/app/shared/components/core/popover/popover.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { CollectionCard } from 'src/app/shared/models/collection.model';
import { CardTypePipe } from 'src/app/shared/pipes/card-type.pipe';
import { TcgMarketPricePipe } from 'src/app/shared/pipes/get-tcg-market-price.pipe';
import { CollectionService } from 'src/services/portfolio/collection.service';
import { CardsSearchComponent } from '../../cards/cards-search/cards-search.component';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.scss',
  imports: [
    CardsSearchComponent,
    GridModule,
    MatPaginatorModule,
    PopoverModule,
    HeaderModule,
    RouterModule,
    CardModule,
    MatMenuModule,
    ButtonModule,
    LoadingComponent,
    VirtualCardsGridComponent,
    ActionBarComponent,
    TcgMarketPricePipe,
    CardTypePipe,
    LabelTagChipComponent,
  ],
})
export class PortfolioDetailComponent implements OnInit {
  private readonly popupService = inject(PopupService);
  private readonly collectionService = inject(CollectionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  virtualGrid = viewChild<VirtualCardsGridComponent>(VirtualCardsGridComponent);

  quantityControl = new FormControl(null);

  destroyRef = inject(DestroyRef);
  dataLoader: (params: any) => Observable<any>;

  loading = false;
  collection: any;

  ngOnInit() {
    this.loading = true;
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.collection = res.collection;
      this.dataLoader = this.getCards();
      this.loading = false;
    });
  }

  onRowClick(event: any) {
    this.router.navigateByUrl(`/cards/${event.cardSource?.id}`);
  }

  getCards() {
    return (params) => this.collectionService.getCardsByCollectionId(this.collection.id, params);
  }

  updateQuantity(card: any, quantity: number, updateQuantityPopover: PopoverPanelComponent) {
    card.quantity = quantity;
    updateQuantityPopover.close();
    this.collectionService.updateCardQuantity(card).subscribe({
      next: () => {
        this.popupService.success('Updated card quantity successfully');
      },
      error: () => {
        this.popupService.error('Failed to update card quantity');
      },
    });
  }

  removeCard(card: CollectionCard, removeCardPanel: PopoverPanelComponent) {
    this.collectionService.removeCard(this.collection.id, card.id).subscribe({
      next: () => {
        this.popupService.success('Removed card successfully');
        this.virtualGrid().virtualDatasource.reload();
        removeCardPanel.close();
      },
      error: () => {
        this.popupService.error('Failed to remove card from collection');
        removeCardPanel.close();
      },
    });
  }
}

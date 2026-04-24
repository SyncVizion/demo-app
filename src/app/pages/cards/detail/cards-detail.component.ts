import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { switchMap, tap } from 'rxjs';
import { CardQtyDialogComponent } from 'src/app/shared/components/common/card-qty-dialog/card-qty-dialog.component';
import { CardQtyComponent } from 'src/app/shared/components/common/card-qty/card-qty.component';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { LabelTagChipComponent } from 'src/app/shared/components/core/label-tag-chip/label-tag-chip.component';
import { CARD_TYPE_TRANSLATIONS, PokemonCard } from 'src/app/shared/models/pokemon-card.model';
import { DialogService } from 'src/services/dialog.service';
import { CollectionService } from 'src/services/portfolio/collection.service';
import { CardBottomSheetComponent } from './bottom-sheet/card-bottom-sheet.component';

@Component({
  selector: 'app-cards-detail',
  templateUrl: './cards-detail.component.html',
  styleUrls: ['./cards-detail.component.scss'],
  imports: [
    GridModule,
    HeaderModule,
    RouterModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    CurrencyPipe,
    DecimalPipe,
    CardQtyComponent,
    LabelTagChipComponent,
    MatProgressSpinnerModule,
    NgxChartsModule,
  ],
})
export class CardsDetailComponent implements OnInit {
  private readonly collectionService = inject(CollectionService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);

  private readonly cardTypeColors = {
    NORMAL: '#4ECDC49f',
    HOLOFOIL: '#FF6B6B9f',
    REVERSE_HOLOFOIL: '#9B59B69f',
    UNLIMITED_HOLOFOIL: '#3498DB9f',
    FIRST_EDITION_HOLOFOIL: '#F39C129f',
    FIRST_EDITION_NORMAL: '#E67E229f',
  };

  colorScheme = { domain: ['#6161619f'] };
  priceChartData: { name: string; series: { name: string; value: number }[] }[] = [];

  loading = false;
  destroyRef = inject(DestroyRef);

  card: PokemonCard;
  userCollectionsCard = [];
  totalQtyInCollections = 0;
  collectionsLoading = true;

  image: any;
  currentPrice: number | null = null;
  priceUnit = 'EUR';
  priceChangePercent: number | null = null;
  priceDirection: 'up' | 'down' | 'flat' = 'flat';

  ngOnInit() {
    this.loading = true;
    this.route.data
      .pipe(
        tap((res) => (this.card = res['card'])),
        tap(() => this.updatePriceSummary()),
        tap(() => (this.image = this.buildImageUrl(this.card?.image))),
        tap(() => (this.collectionsLoading = true)),
        switchMap(() => this.collectionService.getCollectionsByCardId(this.card.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.totalQtyInCollections = res.reduce((total, collection) => total + collection.quantity, 0);
        this.userCollectionsCard = res;
        this.collectionsLoading = false;
      });
  }

  onCardClick() {
    this.dialogService.openSheet(CardBottomSheetComponent, {
      data: this.card,
      height: '75vh',
      minHeight: '500px',
    });
  }

  buildImageUrl(image: string): string {
    if (!image) {
      return null;
    }
    if (image.endsWith('.png') || image.endsWith('.jpg')) {
      return image;
    }
    return image + '/high.webp';
  }

  updatePriceSummary(): void {
    const cardMarket = this.card?.cardmarket;
    if (!cardMarket) {
      this.currentPrice = null;
      this.priceChangePercent = null;
      this.priceDirection = 'flat';
      return;
    }

    this.priceUnit = 'EUR';
    this.currentPrice = this.getFirstPositiveNumber(
      cardMarket.trendPrice,
      cardMarket.averageSellPrice,
      cardMarket.avg7,
      cardMarket.lowPrice,
    );
    this.buildPriceChartData();

    const baseline = this.getFirstPositiveNumber(
      cardMarket.avg7,
      cardMarket.avg30,
      cardMarket.averageSellPrice,
      cardMarket.lowPrice,
    );
    if (this.currentPrice === null || baseline === null || baseline === 0) {
      this.priceChangePercent = null;
      this.priceDirection = 'flat';
      return;
    }

    const rawPercent = ((this.currentPrice - baseline) / baseline) * 100;
    this.priceChangePercent = Number(rawPercent.toFixed(2));

    if (this.priceChangePercent > 0) {
      this.priceDirection = 'up';
      return;
    }

    if (this.priceChangePercent < 0) {
      this.priceDirection = 'down';
      return;
    }

    this.priceDirection = 'flat';
  }

  buildPriceChartData(): void {
    const tcgplayer = this.card?.tcgplayer;
    if (!tcgplayer) {
      this.priceChartData = [];
      return;
    }

    // Handle both single object and array of TCGPlayer entries
    const entries = tcgplayer.prices;
    const series: { name: string; series: { name: string; value: number }[] }[] = [];
    const cardTypes: string[] = [];

    entries.forEach((entry) => {
      const priceSeriesData = [
        { name: 'Market', value: entry.market ?? 0 },
        { name: 'Mid', value: entry.mid ?? 0 },
        { name: 'Low', value: entry.low ?? 0 },
      ];

      const cardTypeName = CARD_TYPE_TRANSLATIONS[entry.cardType] || 'Normal';
      cardTypes.push(entry.cardType);
      series.push({
        name: cardTypeName,
        series: priceSeriesData,
      });
    });

    this.priceChartData = series;
    this.updateColorSchemeForCardTypes(cardTypes);
  }

  /** Updates the color scheme based on the card types present in the price chart data. */
  private updateColorSchemeForCardTypes(cardTypes: string[]): void {
    const colors = cardTypes.map((type) => this.cardTypeColors[type] || '#808080f9');
    this.colorScheme = { domain: colors };
  }

  getFirstPositiveNumber(...values: Array<number | undefined>): number | null {
    for (const value of values) {
      if (typeof value === 'number' && value > 0) {
        return value;
      }
    }

    return null;
  }

  updateCollectionCardQty(collectionCard: any, newQty: number) {
    collectionCard.quantity = newQty;
    this.totalQtyInCollections = this.userCollectionsCard.reduce((total, collection) => total + collection.quantity, 0);

    // TODO: Make request to update qty
  }

  showQtyUpdateDialog(collectionCard: any) {
    const quantityDialog = this.dialogService.open(CardQtyDialogComponent, {
      data: collectionCard,
      width: '300px',
    }).componentInstance;

    quantityDialog.onSave().subscribe((qty) => {
      console.log('Saving card with qty:', qty);
    });
  }

  onAddToCollection() {}
}

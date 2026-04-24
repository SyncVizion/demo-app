import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { VirtualDataSource } from 'src/app/shared/components/core/virtual-scroll/virtual-scroll-datasource.component';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';
import { VirtualScrollConfig } from 'src/app/shared/models/virtual-scroll.model';
import { SetsService } from 'src/services/pokemon/sets.service';
import { CardsSearchComponent } from '../cards/cards-search/cards-search.component';

@Component({
  selector: 'app-sets-grid',
  templateUrl: './sets-grid.component.html',
  styleUrl: './sets-grid.component.scss',
  imports: [
    MatIconModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ScrollingModule,
    CardsSearchComponent,
    NgTemplateOutlet,
    AppSkeletonLoaderDirective,
  ],
})
export class SetsGridComponent {
  private readonly service = inject(SetsService);
  private readonly router = inject(Router);

  viewport = viewChild<CdkVirtualScrollViewport>(CdkVirtualScrollViewport);

  virtualDatasource: any;

  constructor() {
    this.virtualDatasource = new VirtualDataSource((params) => this.service.get(params), this.buildVirtualConfig());
  }

  onRowClick(event: any) {
    this.router.navigateByUrl(`/sets/${event.id}`);
  }

  onSearchChange(searchValue: string) {
    searchValue.length > 0
      ? this.virtualDatasource.filterChange(new Map([['search', [searchValue]]]))
      : this.virtualDatasource.filterChange(new Map());
    this.viewport().scrollToIndex(0, 'smooth');
  }

  buildVirtualConfig() {
    return {
      pageSize: 10,
      cacheSize: 1000,
      displayField: 'id',
    } as VirtualScrollConfig;
  }
}

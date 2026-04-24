import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  contentChild,
  DestroyRef,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { VirtualScrollConfig } from 'src/app/shared/components/core/form/form-field-single-select-virtual/virtual-scroll-dropdown.datasource';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { VirtualDataSource } from 'src/app/shared/components/core/virtual-scroll/virtual-scroll-datasource.component';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';

@Component({
  selector: 'app-virtual-cards-grid',
  templateUrl: './virtual-cards-grid.component.html',
  styleUrl: './virtual-cards-grid.component.scss',
  host: {
    class: 'overall-container',
  },
  imports: [
    GridModule,
    MatIconModule,
    NgTemplateOutlet,
    HeaderModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    AppSkeletonLoaderDirective,
  ],
})
export class VirtualCardsGridComponent implements AfterContentInit {
  destroyRef = inject(DestroyRef);

  viewport = viewChild<CdkVirtualScrollViewport>(CdkVirtualScrollViewport);
  cardContentHeader = contentChild('cardContentHeader', { read: TemplateRef<any> });
  cardContent = contentChild('cardContent', { read: TemplateRef<any> });

  dataloader = input<(params) => Observable<any>>();
  virtualConfig = input<VirtualScrollConfig>();
  viewType = input<'grid' | 'single'>('grid');
  itemSize = input<number>(200);
  minBufferPx = input<number>(300);
  maxBufferPx = input<number>(900);
  headerBuffer = input<boolean>(true);
  cardClass = input<string>('');

  rowClick = output<any>();

  virtualDatasource: any;

  ngAfterContentInit(): void {
    this.virtualDatasource = new VirtualDataSource(this.dataloader(), this.buildVirtualConfig());
  }

  onSearchChange(searchValue: string) {
    searchValue.length > 0
      ? this.virtualDatasource.filterChange(new Map([['search', [searchValue]]]))
      : this.virtualDatasource.filterChange(new Map());
    this.viewport().scrollToIndex(0, 'smooth');
  }

  buildVirtualConfig() {
    if (this.virtualConfig()) {
      return this.virtualConfig();
    }
    return {
      pageSize: 10,
      cacheSize: 1000,
      displayField: 'id',
    } as VirtualScrollConfig;
  }
}

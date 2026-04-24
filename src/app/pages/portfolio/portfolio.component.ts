import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopoverPanelComponent } from 'src/app/shared/components/core/popover/popover.component';
import { PopoverModule } from 'src/app/shared/components/core/popover/popover.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { VirtualDataSource } from 'src/app/shared/components/core/virtual-scroll/virtual-scroll-datasource.component';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';
import { Collection } from 'src/app/shared/models/collection.model';
import { VirtualScrollConfig } from 'src/app/shared/models/virtual-scroll.model';
import { DialogService } from 'src/services/dialog.service';
import { CollectionService } from 'src/services/portfolio/collection.service';
import { AddCollectionDialog } from './add-collection-dialog/add-collection-dialog.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  imports: [
    IconModule,
    ButtonModule,
    CardModule,
    ScrollingModule,
    MatMenuModule,
    PopoverModule,
    NgTemplateOutlet,
    AppSkeletonLoaderDirective,
  ],
})
export class PortfolioComponent {
  private readonly service = inject(CollectionService);
  private readonly popupService = inject(PopupService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  viewport = viewChild<CdkVirtualScrollViewport>(CdkVirtualScrollViewport);

  virtualDatasource: any;

  constructor() {
    this.virtualDatasource = new VirtualDataSource((params) => this.service.get(params), this.buildVirtualConfig());
  }

  openCreateCollectiontDialog() {
    const collectionDialog = this.dialogService.open(AddCollectionDialog).componentInstance;

    collectionDialog.onSaved().subscribe(() => {
      this.virtualDatasource.reload();
      this.viewport().scrollToIndex(0, 'smooth');
    });
  }

  openEditCollectionDialog(collection: any) {
    const collectionDialog = this.dialogService.open(AddCollectionDialog, {
      data: collection,
    }).componentInstance;

    collectionDialog.onSaved().subscribe(() => {
      this.virtualDatasource.reload();
      this.viewport().scrollToIndex(0, 'smooth');
    });
  }

  deleteCollection(collection: Collection, deletePanel: PopoverPanelComponent) {
    this.service.delete(collection.id).subscribe({
      next: () => {
        this.popupService.success('Deleted collection successfully');
        this.virtualDatasource.reload();
        deletePanel.close();
      },
      error: () => {
        this.popupService.error('Failed to delete collection');
        deletePanel.close();
      },
    });
  }
  onCardClick(element: any) {
    this.router.navigate([`/portfolio/${element.id}`]);
  }

  buildVirtualConfig() {
    return {
      pageSize: 10,
      cacheSize: 1000,
      displayField: 'id',
    } as VirtualScrollConfig;
  }
}

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';

export interface VirtualScrollConfig {
  pageSize?: number;
  cacheSize?: number;
  displayField?: string;
}

export class DropdownVirtualDataSource extends DataSource<string | undefined> {
  private cachedData = Array.from<string>({ length: this.cacheSize });
  private readonly loadedPages = new Set<number>();
  private readonly virtualDataStream = new BehaviorSubject<any[]>(this.cachedData);

  destroy = new Subject<void>();
  totalElements: number;
  loading = false;
  noResults = false;

  constructor(
    private readonly dataloader: (params) => Observable<Page<any>>,
    private readonly config?: VirtualScrollConfig,
  ) {
    super();
  }

  get cacheSize(): number {
    return this.config?.cacheSize || 1000;
  }

  get pageSize(): number {
    return this.config?.pageSize || 20;
  }

  /**
   * Initializes the data source by subscribing to the collection viewer's view change.
   *
   * @param collectionViewer The collection viewer that provides the view change observable.
   * @returns The observable that emits the data for the virtual scroll.
   */
  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    collectionViewer.viewChange.pipe(takeUntil(this.destroy)).subscribe((range) => {
      const startPage = Math.floor(range.start / this.pageSize);
      const endPage = Math.floor((range.end - 1) / this.pageSize);

      for (let i = startPage; i <= endPage; i++) {
        this.loading = true;
        this._fetchPage(i);
      }
    });
    return this.virtualDataStream;
  }

  /**
   * Disconnects the data source by unsubscribing from the collection viewer's view change.
   */
  disconnect(): void {
    this.destroy.next();
  }

  /**
   * Fetches a specific page of data from the data loader.
   *
   * @param page The page number to fetch.
   */
  private _fetchPage(page: number) {
    if (this.loadedPages.has(page)) {
      return;
    }
    this.loadedPages.add(page);

    this.dataloader(new Map().set('page', page).set('size', this.pageSize))
      .pipe(
        catchError(() => of(Page.emptyPage())),
        takeUntil(this.destroy),
      )
      .subscribe((res: Page<any>) => this.updateData(res, page));
  }

  /**
   * Updates the cached data with the new data for a specific page.
   *
   * @param data The data to update the cache with.
   * @param page The page number to update in the cache.
   */
  private updateData(data: Page<any>, page: number) {
    if (!this.totalElements) {
      this.totalElements = data.totalElements;

      if (this.totalElements === 0) {
        this.noResults = true;
        this.cachedData = Array.from<string>({ length: 1 });
      } else {
        this.cachedData = Array.from<string>({ length: this.totalElements });
      }
    }

    if (this.cachedData.filter((c) => c).length >= this.cacheSize) {
      this.cachedData = Array.from<string>({ length: this.cacheSize });
    }

    const mappedData = data.content.map((val) => {
      if (this.config?.displayField) {
        return { virtualDisplay: val[this.config.displayField], ...val };
      } else {
        return val;
      }
    });

    this.cachedData.splice(page * this.pageSize, this.pageSize, ...mappedData);
    this.virtualDataStream.next(this.cachedData);
    this.loading = false;
  }
}

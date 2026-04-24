import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';
import { VirtualScrollConfig } from '../form/form-field-single-select-virtual/virtual-scroll-dropdown.datasource';

export class VirtualDataSource extends DataSource<string | undefined> {
  private cachedData: (string | undefined)[] = [];
  private readonly loadedPages = new Map<number, number>(); // page -> startIndex
  private readonly queuedPages = new Set<number>();
  private readonly virtualDataStream = new BehaviorSubject<(string | undefined)[]>([]);
  private readonly pendingPages: number[] = [];

  private isFetching = false;

  stopDatasource = new Subject<void>();
  totalElements: number = 0;
  hasNextPage = signal(true);
  loading = signal(false);
  loadingPageOne = signal(false);
  noResults = signal(false);
  additionalParams = new Map<string, string[]>();

  constructor(
    private readonly dataloader: (params: Map<string, string[]>) => Observable<Page<any>>,
    private readonly config?: VirtualScrollConfig,
  ) {
    super();
    this.queuePage(0);
  }

  get cacheSize(): number {
    return this.config?.cacheSize || 1000;
  }

  get pageSize(): number {
    return this.config?.pageSize || 20;
  }

  /**
   * Connects the data source to the collection viewer and subscribes to viewport range changes.
   *
   * @param collectionViewer The CollectionViewer instance from the virtual scroll component, used to track viewport changes.
   * @returns An observable stream of the current cached data to be rendered in the virtual scroll viewport.
   */
  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    collectionViewer.viewChange.pipe(takeUntil(this.stopDatasource)).subscribe((range) => {
      this.handleViewChange(range);
    });

    return this.virtualDataStream;
  }

  /**
   * Reloads the data source by clearing all cached data and re-queuing the first page.
   */
  reload(): void {
    this.clear();
    this.queuePage(0);
  }

  /**
   * Applies new filter parameters, clears existing state, and re-queues from page zero.
   *
   * @param params A map of filter parameters to apply to the dataloader when fetching pages.
   *               These will be merged with any existing additionalParams before each fetch.
   */
  filterChange(params: Map<string, string[]>): void {
    this.additionalParams = params;
    this.clear();
    this.queuePage(0, params);
  }

  /**
   * Clears all cached data, resets loaded and queued page tracking, and emits an empty data stream.
   */
  clear(): void {
    this.cachedData = [];
    this.loadedPages.clear();
    this.queuedPages.clear();
    this.totalElements = 0;
    this.noResults.set(false);
    this.virtualDataStream.next(this.cachedData);
  }

  /**
   * Disconnects the data source from the collection viewer and cleans up all subscriptions by emitting on the stopDatasource subject.
   */
  disconnect(): void {
    this.stopDatasource.next();
  }

  /**
   * Handles changes in the viewport range by calculating which pages are now visible and queuing
   * them for loading if they haven't been loaded or queued already.
   * @param range The range of items currently visible in the viewport.
   */
  private handleViewChange(range: { start: number; end: number }): void {
    const startPage = Math.floor(range.start / this.pageSize);
    const endPage = Math.floor((range.end - 1) / this.pageSize);

    for (let i = startPage; i <= endPage + 1; i++) {
      this.queuePage(i);
    }
  }

  /**
   * Adds a page to the pending queue if it has not already been loaded or queued.
   * Merges any stored additionalParams into the provided params map before processing.
   */
  private queuePage(page: number, params: Map<string, string[]> = new Map()): void {
    if (this.loadedPages.has(page) || this.queuedPages.has(page)) return;

    this.additionalParams.forEach((value, key) => {
      params.set(key, value);
    });
    this.queuedPages.add(page);
    this.pendingPages.push(page);
    this.processQueue(params);
  }

  /**
   * Dequeues and fetches the next pending page if no fetch is currently in progress.
   * Sets loading state indicators, applies pagination params, and skips the network
   * request if there is no next page.
   *
   * @param params The parameters to pass to the dataloader, including pagination and any additional filters.
   */
  private processQueue(params: Map<string, string[]>): void {
    if (this.isFetching || this.pendingPages.length === 0) return;

    const page = this.pendingPages.shift();
    if (page === undefined) return;

    this.isFetching = true;
    this.loading.set(true);
    if (page === 0) {
      this.loadingPageOne.set(true);
    }

    params.set('page', [page.toString()]);
    params.set('size', [this.pageSize.toString()]);

    if (!this.hasNextPage() && !this.loadingPageOne()) {
      this.handleNoNextPage(page);
      return;
    }

    this.fetchPage(page, params);
  }

  /**
   * Marks the page as loaded and clears loading state without making a network request,
   * used when there are no further pages to fetch.
   *
   * @param page The page number that was attempted to be fetched but has no next page available.
   */
  private handleNoNextPage(page: number): void {
    this.loading.set(false);
    this.loadingPageOne.set(false);
    this.isFetching = false;
    this.loadedPages.set(page, page * this.pageSize);
    this.queuedPages.delete(page);
  }

  /**
   * Invokes the dataloader for the given page, maps the response through updateData,
   * and continues processing the queue on completion.
   *
   * @param page The page number to fetch.
   * @param params The parameters to pass to the dataloader, including pagination and any additional filters.
   */
  private fetchPage(page: number, params: Map<string, string[]>): void {
    this.dataloader(params)
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.stopDatasource),
      )
      .subscribe((res: Page<any> | null) => {
        if (res) {
          this.loadedPages.set(page, page * this.pageSize);
          this.queuedPages.delete(page);
          this.updateData(res, page);
        }

        this.loadingPageOne.set(false);
        this.isFetching = false;
        this.loading.set(false);
        this.processQueue(params);
      });
  }

  /**
   * Merges a newly fetched page into the cache, updates the hasNextPage and noResults
   * signals, and emits the updated data stream.
   *
   * @param data The page of data returned from the dataloader, containing content and pagination info.
   * @param page The page number that was fetched, used to calculate the correct index for merging into the cache.
   */
  private updateData(data: Page<any>, page: number): void {
    this.hasNextPage.set(!(data.first && data.last));
    if (!this.totalElements) {
      this.totalElements = data.numberOfElements ?? data.content?.length ?? 0;

      if (this.totalElements === 0) {
        this.noResults.set(true);
        this.cachedData = [];
        this.virtualDataStream.next(this.cachedData);
        return;
      }
    }

    const startIndex = page * this.pageSize;
    const mappedData = this.mapPageContent(data.content);
    this.cachedData.splice(startIndex, mappedData.length, ...mappedData);

    this.trimCacheIfNeeded();

    this.virtualDataStream.next(this.cachedData);
  }

  /**
   * Maps raw page content items, optionally injecting a `virtualDisplay` property
   * using the configured displayField for use in virtual scroll item rendering.
   *
   * @param content The array of items from the fetched page to be mapped for virtual scroll display.
   * @return An array of items with optional `virtualDisplay` properties for rendering in the virtual scroll viewport.
   */
  private mapPageContent(content: any[]): any[] {
    return content.map((val) => {
      if (this.config?.displayField) {
        return { virtualDisplay: val[this.config.displayField], ...val };
      } else {
        return val;
      }
    });
  }

  /**
   * Removes items from the front of the cache when it exceeds the configured cacheSize,
   * and adjusts the loadedPages index map to reflect the removed entries.
   */
  private trimCacheIfNeeded(): void {
    if (this.cachedData.length > this.cacheSize) {
      const excess = this.cachedData.length - this.cacheSize;
      this.cachedData.splice(0, excess);

      // Adjust loadedPages indexes after trimming
      this.loadedPages.forEach((idx, p) => {
        this.loadedPages.set(p, idx - excess);
      });
    }
  }
}

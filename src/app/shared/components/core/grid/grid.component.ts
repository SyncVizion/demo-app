import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  AfterContentInit,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  effect,
  EventEmitter,
  forwardRef,
  inject,
  input,
  model,
  Output,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { catchError, debounceTime, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';
import { PreferenceService } from 'src/services/preferences/preference.service';
import { CardComponent } from '../card/card.component';
import { CardModule } from '../card/card.module';
import { GridFilterBarComponent } from './filters/bar/grid-filter-bar.component';
import { GridChecklistColumnComponent } from './grid-checklist-column/grid-checklist-column.component';
import { GridColumnComponent } from './grid-column/grid-column.component';
import { GridPagerComponent } from './grid-pager/grid-pager.component';
import { GridParamBuilder } from './grid-param.builder';
import {
  GRID_PAGER_OPERATOR,
  GridPagerOperator,
  GridPreference,
  GridQueryParams,
  GridSort,
  PagerPage,
} from './grid.model';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  host: { class: 'grid', '[class.grid--pager]': 'pager()' },
  imports: [
    forwardRef(() => CardComponent),
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    CardModule,
    MatCheckboxModule,
    AppSkeletonLoaderDirective,
  ],
})
export class GridComponent implements AfterContentInit {
  pagerOperator = inject<GridPagerOperator>(GRID_PAGER_OPERATOR);
  private readonly preferenceService = inject(PreferenceService);

  title = input<string>();
  translationKeyPrefix = input<string>();
  preferenceKey = input<string>();
  dataloader = input<(params) => Observable<any>>();
  dataObservable = model<Observable<any>>();
  fixedLayout = input(false, { transform: booleanAttribute });

  columns = contentChildren(GridColumnComponent);
  filterBar = contentChild(GridFilterBarComponent);
  pager = contentChild(GridPagerComponent);
  checklistColumn = contentChild(GridChecklistColumnComponent);

  displayedColumns = computed(() => [...this.dyanmicColumns(), ...this.columns().map((col) => col.label())]);
  isClickable = model(false);
  loading = signal(true);

  // TODO: Replace with the following once angular exposes listeners on OutputEmitterRef (hopefully)
  // https://github.com/angular/angular/issues/54837
  // https://github.com/angular/angular/pull/55793
  // rowClick = output<any>();
  @Output() rowClick = new EventEmitter<any>();
  afterRefresh = output<any>();
  dataUpdated = output<void>();

  destroyRef = inject(DestroyRef);
  cardWrapper = inject(CardComponent, { host: true, optional: true });

  data: WritableSignal<any[]> = signal([]);
  datasource$: Observable<any>;
  stopListeningForData = new Subject<void>();
  initComplete = false;
  isFirstLoad = true;
  contentInitialized = false;
  previousPageSize = 0;
  private readonly dyanmicColumns = signal([]);
  checklistSelections = new SelectionModel<any>(true, []);

  currentFilters: Map<string, string[]> = new Map();
  currentSort: GridSort = null;

  private readonly useDataObservable = computed(() => !!this.dataObservable());
  private readonly dataLoaderSubject: Subject<HttpResponse<any[]>> = new Subject<HttpResponse<any[]>>();
  private readonly preferenceUpdateSubject: Subject<void> = new Subject<void>();

  constructor() {
    effect(() => {
      this.data();
      if (!this.isFirstLoad) {
        this.afterDataUpdated(this.data());
      }
    });

    effect(() => {
      this.loading.set(true);
      if (this.dataloader() && this.contentInitialized) {
        this.loadData();
      }
    });
  }

  ngAfterContentInit(): void {
    this.initGrid();
    this.contentInitialized = true;
  }

  /**
   * Initializes the grid by setting up the data source and subscribing to data changes.
   */
  initGrid() {
    if (this.dataloader() && this.dataObservable()) {
      throw new Error('dataObservable input and dataLoader input cannot be used together.');
    }

    if (this.rowClick.observed) {
      this.isClickable.set(true);
    }

    if (this.useDataObservable()) {
      this.loading.set(true);
      this.datasource$ = this.dataObservable();
      this.isFirstLoad = false;
    } else {
      this.datasource$ = this.dataLoaderSubject.asObservable();
    }

    this.initDataSubscription();
    this.initFilterBarSubscription();
    this.initPagerSubscription();
    this.initChecklistColumn();
    this.listenForPreferenceUpdates();

    this.loadGridConfig();
  }

  /**
   * Loads the grid config and data based on the users preferences. If the user does not have any then it will
   * load the default grid config.
   */
  loadGridConfig() {
    if (this.preferenceKey()) {
      this.loading.set(true);
      this.preferenceService
        .getByKey<GridPreference>(this.preferenceKey())
        .pipe(take(1))
        .subscribe((pref) => {
          this.currentFilters = pref?.preferences?.filters
            ? new Map(Object.entries(pref?.preferences?.filters))
            : new Map();
          this.currentSort = pref?.preferences?.sort || null;

          this.configureFilters();
          if (!this.useDataObservable()) {
            this.loadData();
          }
        });
    }

    if (!this.preferenceKey() && !this.useDataObservable()) {
      this.loadData();
    }
  }

  /**
   * Configures the filters based on the current filters.
   */
  configureFilters() {
    if (this.currentFilters.size > 0) {
      this.filterBar()
        ?.filters()
        .forEach((filter) => {
          if (this.currentFilters.has(filter.key())) {
            filter.value = this.currentFilters.get(filter.key());
          }
        });
    }
  }

  /**
   * Initializes the page listener for the grid. If the user changes the page on the grid.
   */
  initPagerSubscription() {
    if (!this.pager()) {
      return;
    }

    this.previousPageSize = this.pager().pageSize();

    this.pager()
      .pageChange()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        // Return to the first page if the page size changes
        if (Number(this.previousPageSize) !== res.pageSize) {
          this.previousPageSize = res.pageSize;
          this.pager().firstPage();
        }

        this.refresh();
      });
  }

  /**
   * When the user sorts the grid, it will reload the data with the new sort params.
   *
   * @param sortChange The sort change event.
   */
  onSortChange(sortChange: Sort) {
    this.pager().firstPage();
    const field = this.columns()
      .find((c) => c.label() === sortChange.active)
      ?.field();
    this.currentSort = { field, ...sortChange };

    this.preferenceUpdateSubject.next();
    this.refresh();
  }

  /**
   * Updates the pager with the new data.
   */
  updatePager(response: PagerPage<any>) {
    if (!this.pager()) {
      return;
    }

    this.pager().setPaginatorLength(response.totalCount);
  }

  /**
   * Refreshes the grid by performing a call on the dataloader to
   * refresh.
   */
  refresh() {
    this.loadData();
  }

  /**
   * Loads the data from the data loader.
   */
  loadData() {
    if (!this.dataloader()) {
      return;
    }

    this.loading.set(true);
    this.stopListeningForData.next();

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
    }

    this.dataloader()(this.getQueryParams())
      .pipe(
        catchError(() => of([])),
        takeUntil(this.stopListeningForData),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => this.updateData(res));
  }

  /**
   * Updates the data from an HttpResponse
   *
   * @param response The HttpResponse used to update the data
   */
  updateData(response: HttpResponse<any>) {
    this.dataLoaderSubject.next(response);
  }

  /**
   * Initializes the subscription to listen for data changes.
   */
  initDataSubscription() {
    this.datasource$
      .pipe(
        this.pagerOperator(this.translationKeyPrefix()),
        tap(() => (this.initComplete = true)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: PagerPage<any>) => {
        this.updatePager(res);
        this.data.set(res.data);
      });
  }

  /**
   * Initializes the filter bar subscription.
   */
  initFilterBarSubscription() {
    if (!this.filterBar()) {
      return;
    }

    this.filterBar()
      .onFilterChange()
      .pipe(
        tap(() => this.pager().firstPage()),
        tap((f) => (this.currentFilters = f)),
        tap(() => this.preferenceUpdateSubject.next()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.refresh());
  }

  /**
   * Initializes the checklist column for the grid
   */
  initChecklistColumn() {
    if (!this.checklistColumn()) {
      return;
    }
    this.dyanmicColumns.update((columns) => [...columns, 'checklist']);
  }

  /**
   * Listens for updates to the user preferences
   */
  listenForPreferenceUpdates() {
    this.preferenceUpdateSubject
      .pipe(
        debounceTime(1000),
        switchMap(() => this.updatePreferences()),
      )
      .subscribe();
  }

  /**
   * Emits the row click event. If ignoreClick is true, the event is not emitted.
   *
   * @param row The row that was clicked
   * @param ignoreClick  Whether to ignore the click event
   */
  onRowClick(row: any, ignoreClick: boolean) {
    if (ignoreClick && !this.loading()) {
      return;
    }

    this.rowClick.emit(row);
  }

  /**
   * Returns the request parameters to use when loading data
   *
   * @param withPagination whether or not the data should be paginated
   */
  getQueryParams(): GridQueryParams {
    const params = new GridParamBuilder().withFilters(this.currentFilters).withSort(this.currentSort).build();
    if (this.pager()) {
      params.set('page', [this.pager().getPageIndex().toString()]);
      params.set('size', [this.pager().getPageSize().toString()]);
    }

    return params;
  }

  /**
   * Updates the grid state after the data has been updated.
   */
  private afterDataUpdated(updatedData: any) {
    if (!this.initComplete) {
      return;
    }

    this.dataUpdated.emit();
    this.loading.set(false);
    this.afterRefresh.emit(updatedData);
  }

  /**
   * Updates the user preferences with the current filters.
   *
   * @returns The observable that resolves when the preferences are updated.
   */
  private updatePreferences() {
    if (this.preferenceKey()) {
      return this.preferenceService.set(this.preferenceKey(), {
        filters: Object.fromEntries(this.currentFilters),
        sort: this.currentSort,
      });
    } else {
      return of(null);
    }
  }
}

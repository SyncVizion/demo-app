import {
  booleanAttribute,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-grid-pager',
  templateUrl: './grid-pager.component.html',
  imports: [MatPaginatorModule],
})
export class GridPagerComponent implements OnInit {
  paginator = viewChild<MatPaginator>(MatPaginator);
  pageSize = model(15);
  hidePageSize = input(false, { transform: booleanAttribute });
  key = input('');
  pageSizeOptions = input([5, 10, 15, 25]);
  pagerStyle = input('');

  totalCountChange = output<number>();
  change = output<PageEvent>();
  destroyRef = inject(DestroyRef);
  disabled = false;

  ngOnInit() {
    this.pageChange().subscribe((event: PageEvent) => this.change.emit(event));
  }

  /**
   * Updates the page size and index of the paginator
   *
   * @param pageSize The new page size
   * @param index The new index
   */
  updatePageSize(pageSize: number, index: number) {
    this.pageSize.set(pageSize);
    this.paginator().pageSize = pageSize;
    this.paginator().pageIndex = Math.floor(index);
  }

  /**
   * Gets the paginator
   *
   * @returns The paginator
   */
  getPaginator() {
    return this.paginator;
  }

  /**
   * Sets the length of the paginator
   *
   * @param length The length of the paginator
   */
  setPaginatorLength(length: number | string) {
    this.paginator().length = typeof length === 'string' ? Number(length) : length;
    this.totalCountChange.emit(this.paginator.length);
  }

  /**
   * Gets the page size of the paginator if it exists, otherwise returns
   * the default page size
   *
   * @returns The page size
   */
  getPageSize() {
    return this.paginator()?.pageSize || this.pageSize();
  }

  /**
   * The current page index of the paginator
   *
   * @returns The page index
   */
  getPageIndex() {
    return this.paginator().pageIndex;
  }

  /**
   * Returns to the first page of the paginator
   */
  firstPage() {
    this.paginator().firstPage();
  }

  /**
   * Emits the current page event as an observable
   *
   * @returns The page change event
   */
  pageChange() {
    return this.paginator().page.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}

import { NgModule } from '@angular/core';
import { GridFilterBarComponent } from './filters/bar/grid-filter-bar.component';
import { GridFilterSearchComponent } from './filters/search/grid-filter-search.component';
import { GridFilterSelectComponent } from './filters/select-multi/grid-filter-select.component';
import { GridChecklistColumnComponent } from './grid-checklist-column/grid-checklist-column.component';
import { GridColumnComponent } from './grid-column/grid-column.component';
import { GridPagerComponent } from './grid-pager/grid-pager.component';
import { GridComponent } from './grid.component';
import { GRID_PAGER_OPERATOR_PROVIDER } from './grid.model';

@NgModule({
  imports: [
    GridComponent,
    GridColumnComponent,
    GridFilterBarComponent,
    GridFilterSearchComponent,
    GridFilterSelectComponent,
    GridPagerComponent,
    GridChecklistColumnComponent,
  ],
  exports: [
    GridComponent,
    GridColumnComponent,
    GridFilterBarComponent,
    GridFilterSearchComponent,
    GridFilterSelectComponent,
    GridPagerComponent,
    GridChecklistColumnComponent,
  ],
  providers: [GRID_PAGER_OPERATOR_PROVIDER],
})
export class GridModule {}

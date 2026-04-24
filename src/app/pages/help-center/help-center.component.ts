import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridPagerOperators } from 'src/app/shared/components/core/grid/grid-pager.operator';
import { GridPagerComponent } from 'src/app/shared/components/core/grid/grid-pager/grid-pager.component';
import { GRID_PAGER_OPERATOR } from 'src/app/shared/components/core/grid/grid.model';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { environment } from 'src/environments/environment';
import { DialogService } from 'src/services/dialog.service';
import { GitIssueService } from 'src/services/github/github.service';
import { BugIssueDialog } from './dialogs/bug-issue-dialog/bug-issue-dialog.component';
import { FeatureRequestDialog } from './dialogs/feature-request-dialog/feature-request-dialog.component';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  imports: [
    GridModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    HeaderModule,
    RouterModule,
    CardModule,
    ButtonModule,
    IconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  providers: [{ provide: GRID_PAGER_OPERATOR, useValue: GridPagerOperators.standardObject }],
  styleUrl: './help-center.component.scss',
})
export class HelpCenterComponent {
  private readonly dialogService = inject(DialogService);
  private readonly gitIssueService = inject(GitIssueService);
  private readonly popupService = inject(PopupService);

  private readonly issueObservable: Subject<{ totalElements: number; content: any[] }> = new Subject<{
    totalElements: number;
    content: any[];
  }>();
  issueObservable$: Observable<{ totalElements: number; content: any[] }> = this.issueObservable.asObservable();

  destroyRef = inject(DestroyRef);
  pager = viewChild(GridPagerComponent);

  issues: any[] = [];
  pageCount = 5;

  constructor() {
    this.getIssues();
  }

  getIssues() {
    this.gitIssueService
      .get(environment.companyName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (iss) => {
          this.issues = iss;
          this.issueObservable.next({ totalElements: this.issues.length, content: this.pageData(0) });
        },
        error: () => {
          this.popupService.error('Failed to fetch issues. Please try again later.');
        },
      });
  }

  openFeatureRequestDialog() {
    const featureDialog = this.dialogService.open(FeatureRequestDialog).componentInstance;

    featureDialog.onSaved().subscribe((res) => {
      this.issues.push(res);
      this.pageChange({ pageIndex: 0, pageSize: this.pageCount, length: this.issues.length });
    });
  }

  openBugIssueDialog() {
    const bugDialog = this.dialogService.open(BugIssueDialog).componentInstance;

    bugDialog.onSaved().subscribe((res) => {
      this.issues.push(res);
      this.pageChange({ pageIndex: 0, pageSize: this.pageCount, length: this.issues.length });
    });
  }

  pageChange(event: PageEvent) {
    this.issueObservable.next({ totalElements: this.issues.length, content: this.pageData(event.pageIndex) });
  }

  pageData(pageNumber: number) {
    const startIndex = pageNumber * this.pageCount;
    const endIndex = startIndex + this.pageCount;
    if (!this.issues?.length || this.issues.length === 0) {
      return [];
    }
    return this.issues.slice(startIndex, endIndex);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { BaseDialogComponent } from 'src/app/shared/components/dialogs/base-dialog/dialog-base.component';
import { GithubIssue } from 'src/app/shared/models/github.model';
import { User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { GitIssueService } from 'src/services/github/github.service';

@Component({
  template: '',
  imports: [],
})
export abstract class AbstractIssueDialog extends BaseDialogComponent implements OnInit {
  private readonly popupService = inject(PopupService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly githubIssueService = inject(GitIssueService);

  private readonly saved$ = new Subject<GithubIssue>();

  form: UntypedFormGroup;
  userAccess: User;

  abstract buildForm(): void;

  abstract issueType(): string;

  abstract buildIssueRequest(): GithubIssue;

  constructor() {
    super();
  }

  ngOnInit() {
    this.userAccessService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => (this.userAccess = res));
    this.buildForm();
  }

  onSaved(): Observable<GithubIssue> {
    return this.saved$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }

  submit() {
    this.loading = true;
    let issueRequest = this.buildIssueRequest();

    this.githubIssueService.create(issueRequest).subscribe({
      next: () => {
        issueRequest = {
          ...issueRequest,
          status: 'Reported Issues',
          createdDate: new Date(),
          createdUser: this.userAccess.firstName + ' ' + this.userAccess.lastName,
        };
        this.saved$.next(issueRequest);
        this.close();
        this.popupService.success(`${this.issueType()} successfully submitted`);
      },
      error: (error) => {
        console.error('Error:', error);
        this.close();
        this.popupService.error(`${this.issueType()} could not be submitted`);
      },
    });
  }
}

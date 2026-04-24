import { Component, inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { FormModule } from 'src/app/shared/components/core/form/form.module';
import { GithubIssue } from 'src/app/shared/models/github.model';
import { RequestType } from 'src/app/shared/models/help-center.model';
import { environment } from 'src/environments/environment';
import { AbstractIssueDialog } from '../abstract-issue-dialog.component';

@Component({
  selector: 'bug-issue-dialog',
  templateUrl: 'bug-issue-dialog.component.html',
  imports: [RouterModule, MatDialogModule, FormModule, MatProgressSpinnerModule, ButtonModule],
})
export class BugIssueDialog extends AbstractIssueDialog {
  private readonly formBuilder = inject(UntypedFormBuilder);

  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [null, { validators: [Validators.required, Validators.maxLength(250)] }],
      repoSteps: [null, { validators: [Validators.maxLength(2000)] }],
      result: [null, { validators: [Validators.maxLength(2000)] }],
      environment: [null, { validators: [Validators.maxLength(2000)] }],
      type: RequestType.BUG_ISSUE,
    });
  }

  issueType(): string {
    return 'Bug/Issue';
  }

  buildIssueRequest(): GithubIssue {
    return {
      title: this.form.controls.title.value,
      body: this.buildIssueBody(),
      labels: [environment.companyName],
      type: this.form.controls.type.value,
    };
  }

  buildIssueBody(): string {
    let body = '';
    body += `## Steps to Reproduce:\n- ${this.form.controls.repoSteps.value}\n\n`;
    body += `## Expected vs Actual Behavior:\n- ${this.form.controls.result.value}\n\n`;
    body += `## Device/Browser Environment:\n- ${this.form.controls.environment.value}\n\n`;
    return body;
  }
}

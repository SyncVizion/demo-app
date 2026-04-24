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
  selector: 'feature-request-dialog',
  templateUrl: 'feature-request-dialog.component.html',
  imports: [RouterModule, MatDialogModule, FormModule, MatProgressSpinnerModule, ButtonModule],
})
export class FeatureRequestDialog extends AbstractIssueDialog {
  private readonly formBuilder = inject(UntypedFormBuilder);

  buildForm() {
    this.form = this.formBuilder.group({
      title: [null, { validators: [Validators.required, Validators.maxLength(250)] }],
      function: [null, { validators: [Validators.maxLength(2000)] }],
      useful: [null, { validators: [Validators.maxLength(2000)] }],
      useCase: [null, { validators: [Validators.maxLength(2000)] }],
      type: RequestType.FEATURE,
    });
  }

  issueType(): string {
    return 'Feature';
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
    body += `## What it Does:\n- ${this.form.controls.function.value}\n\n`;
    body += `## Why it is Useful:\n- ${this.form.controls.useful.value}\n\n`;
    body += `## What is it for:\n- ${this.form.controls.useCase.value}`;
    return body;
  }
}

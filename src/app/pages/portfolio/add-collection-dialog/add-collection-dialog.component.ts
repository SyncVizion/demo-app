import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { FormModule } from 'src/app/shared/components/core/form/form.module';
import { BaseDialogComponent } from 'src/app/shared/components/dialogs/base-dialog/dialog-base.component';
import { CollectionService } from 'src/services/portfolio/collection.service';

@Component({
  selector: 'add-collection-dialog',
  templateUrl: 'add-collection-dialog.component.html',
  imports: [RouterModule, MatDialogModule, FormModule, MatProgressSpinnerModule, ButtonModule],
})
export class AddCollectionDialog extends BaseDialogComponent implements OnInit {
  private readonly collectionService = inject(CollectionService);
  private readonly formBuilder = inject(UntypedFormBuilder);

  private readonly saved$ = new Subject<any>();

  form: UntypedFormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [this.data?.title ?? null, { validators: [Validators.required, Validators.maxLength(250)] }],
      publicCollection: [this.data?.publicCollection ?? false],
    });
  }

  updateCreate() {
    this.loading = true;
    if (this.data?.id) {
      this.collectionService.update(this.data.id, this.form.value).subscribe((res) => {
        this.saved$.next(res);
        this.close();
        this.loading = false;
      });
    } else {
      this.collectionService.create(this.form.value).subscribe((res) => {
        this.saved$.next(res);
        this.close();
        this.loading = false;
      });
    }
  }

  onSaved(): Observable<any> {
    return this.saved$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}

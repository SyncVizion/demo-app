import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { LabelTagType } from 'src/app/shared/models/label-tag.model';
import { CardPricingType, TcgPlayerPrice } from 'src/app/shared/models/pokemon-card.model';
import { LabelTagService } from 'src/services/label-tag/label-tag.service';
import { DropdownItem } from '../../core/form/dropdown-item.model';
import { FormModule } from '../../core/form/form.module';
import { BaseDialogComponent } from '../../dialogs/base-dialog/dialog-base.component';

@Component({
  selector: 'app-quantity-condition-dialog',
  templateUrl: './quantity-condition-dialog.component.html',
  styleUrls: ['./quantity-condition-dialog.component.scss'],
  imports: [
    MatDialogModule,
    RouterModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    FormModule,
    MatProgressSpinnerModule,
  ],
})
export class QuantityConditionDialogComponent extends BaseDialogComponent implements OnInit {
  private readonly labelTagService = inject(LabelTagService);
  private readonly formBuilder = inject(UntypedFormBuilder);

  private readonly saved$ = new Subject<any>();

  form: UntypedFormGroup;
  conditions: any;
  cardTypes: DropdownItem[] = [];
  loading = true;

  ngOnInit() {
    this.data?.card?.tcgplayer?.prices?.forEach((price) => {
      this.cardTypes.push(this.matchCardType(price));
    });
    this.cardTypes.length === 0 && this.cardTypes.push(...this.defaultCardType());
    this.labelTagService.getByType(LabelTagType.CONDITION).subscribe((res) => {
      this.conditions = res;
      this.buildForm();
      this.loading = false;
    });
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      condition: [this.data?.condition || null, { Validators: [Validators.required] }],
      quantity: [this.data?.quantity || 1, { Validators: [Validators.required, Validators.min(1)] }],
      cardType: [this.data?.cardType || null, { Validators: [Validators.required] }],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.saved$.next(this.form.value);
    this.close();
  }

  onSaved(): Observable<any> {
    return this.saved$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }

  matchCardType(price: TcgPlayerPrice): DropdownItem {
    switch (price.cardType) {
      case CardPricingType.NORMAL:
        return {
          id: CardPricingType.NORMAL,
          name: 'Normal',
        };
      case CardPricingType.HOLOFOIL:
        return {
          id: CardPricingType.HOLOFOIL,
          name: 'Holofoil',
        };
      case CardPricingType.REVERSE_HOLOFOIL:
        return {
          id: CardPricingType.REVERSE_HOLOFOIL,
          name: 'Reverse Holofoil',
        };
      case CardPricingType.UNLIMITED_HOLOFOIL:
        return {
          id: CardPricingType.UNLIMITED_HOLOFOIL,
          name: 'Unlimited Holofoil',
        };
      case CardPricingType.FIRST_EDITION_HOLOFOIL:
        return {
          id: CardPricingType.FIRST_EDITION_HOLOFOIL,
          name: 'First Edition Holofoil',
        };
      case CardPricingType.FIRST_EDITION_NORMAL:
        return {
          id: CardPricingType.FIRST_EDITION_NORMAL,
          name: 'First Edition Normal',
        };
    }
  }

  defaultCardType(): DropdownItem[] {
    return [
      {
        id: CardPricingType.NORMAL,
        name: 'Normal (TCGPlayer N/A)',
      },
      {
        id: CardPricingType.HOLOFOIL,
        name: 'Holofoil (TCGPlayer N/A)',
      },
      {
        id: CardPricingType.REVERSE_HOLOFOIL,
        name: 'Reverse Holofoil (TCGPlayer N/A)',
      },
      {
        id: CardPricingType.UNLIMITED_HOLOFOIL,
        name: 'Unlimited Holofoil (TCGPlayer N/A)',
      },
      {
        id: CardPricingType.FIRST_EDITION_HOLOFOIL,
        name: 'First Edition Holofoil (TCGPlayer N/A)',
      },
      {
        id: CardPricingType.FIRST_EDITION_NORMAL,
        name: 'First Edition Normal (TCGPlayer N/A)',
      },
    ];
  }
}

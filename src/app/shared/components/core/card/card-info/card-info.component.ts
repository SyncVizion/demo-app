import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, input, output, TemplateRef, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-info',
  templateUrl: 'card-info.component.html',
  host: {
    class: 'card-info',
  },
  imports: [MatIconModule, MatTooltipModule, CommonModule, RouterModule, CdkOverlayOrigin],
})
export class CardInfoComponent {
  editRef = viewChild<CdkOverlayOrigin>('editPopoverOrigin');
  header = input<string>();
  text = input<any>();
  contentColor = input<'DEFAULT' | 'DENIED' | 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ENABLED' | 'DISABLED'>('DEFAULT');
  center = input(false);
  link = input<string>();
  tooltip = input();
  editable = input(false);

  edit = output<void>();

  customContent = contentChild(TemplateRef<any>);

  formattedText = computed(() => {
    if (!this.text()) {
      return '-';
    }

    if (typeof this.text() === 'string') {
      if (this.text().trim() === '') {
        return '-';
      }
    }

    return this.text();
  });
}

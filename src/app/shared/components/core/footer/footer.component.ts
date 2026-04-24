import { Component, inject } from '@angular/core';
import { DialogService } from 'src/services/dialog.service';
import { BasicDialogComponent } from '../../dialogs/base-dialog/basic-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  host: {
    class: 'app-footer',
  },
})
export class FooterComponent {
  private readonly dialogService = inject(DialogService);

  readonly email = 'Admin@SyncVizion.com';

  onAboutUsClick() {
    window.open('https://syncvizion.com', '_blank');
  }

  onContactUsClick() {
    const mailingContent = [];
    mailingContent.push('mailto:');
    mailingContent.push('admin@syncvizion.com');
    mailingContent.push('?subject=' + 'SyncVizion Contact Us');
    window.location.href = mailingContent.join('');
  }

  onPrivacyClick() {
    const privacyDialog = this.dialogService.open(BasicDialogComponent, {
      data: this.privacyPolicyConfig(),
    }).componentInstance;

    privacyDialog.onActionRight().subscribe(() => privacyDialog.close());
  }

  privacyPolicyConfig() {
    return {
      title: 'Privacy Policy',
      type: 'default',
      message:
        'The SyncVizion website uses both session cookies (which expire when you close your browser) and local storage cookies (which remain on your hard drive for an extended period of time) to help enhance your site experience. These cookies do not contain or collect any personal data and are used to deliver content relative to your interests in the site.',
      actionRight: { text: 'Okay', type: 'default' },
    };
  }
}

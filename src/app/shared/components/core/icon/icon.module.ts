import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BadgeIconComponent } from './icon-badge/icon-badge.component';
import { Prefix, Suffix } from './icon.component';

@NgModule({
  imports: [MatIconModule, BadgeIconComponent, Prefix, Suffix],
  exports: [MatIconModule, BadgeIconComponent, Prefix, Suffix],
})
export class IconModule {}

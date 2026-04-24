import { NgModule } from '@angular/core';
import { CardContentComponent } from './card-content/card-content.directive';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardInfoComponent } from './card-info/card-info.component';
import { CardInfoContentComponent } from './card-info/content/card-info-content.component';
import { CardComponent } from './card.component';

@NgModule({
  imports: [CardComponent, CardHeaderComponent, CardContentComponent, CardInfoComponent, CardInfoContentComponent],
  exports: [CardComponent, CardHeaderComponent, CardContentComponent, CardInfoComponent, CardInfoContentComponent],
})
export class CardModule {}

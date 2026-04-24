import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CardModule, HeaderModule, IconModule, ButtonModule, MatSlideToggleModule, MatMenuModule],
})
export class HomeComponent {}

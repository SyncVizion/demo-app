import { NgModule } from '@angular/core';
import { HeaderBackComponent } from './header-back/header-back.component';
import { HeaderDropMenuComponent } from './header-drop-menu/header-drop-menu.component';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [HeaderComponent, HeaderBackComponent, HeaderDropMenuComponent],
  exports: [HeaderComponent, HeaderBackComponent, HeaderDropMenuComponent],
})
export class HeaderModule {}

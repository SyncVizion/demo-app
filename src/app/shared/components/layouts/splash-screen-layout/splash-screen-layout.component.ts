
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-splash-screen-layout',
  templateUrl: './splash-screen-layout.component.html',
  styleUrls: ['./splash-screen-layout.component.scss'],
  imports: [MatIconModule],
})
export class SplashScreenLayoutComponent {
  logoUrl = `assets/images/${environment.companyFolder}/logo.jpeg`;
  showError = input(false);
}

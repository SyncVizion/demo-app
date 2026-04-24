import { Component, DestroyRef, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { FormModule } from 'src/app/shared/components/core/form/form.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  host: { class: 'login__background login-white-inputs' },
  imports: [FormModule, MatProgressBarModule, ButtonModule],
})
export class LoginComponent {
  destroyRef = inject(DestroyRef);
  loginForm: UntypedFormGroup;
  passwordField = 'password';
  loginError = false;
  loading = false;
  logoUrl = `../../assets/images/${environment.companyFolder}/logo.jpeg`;
}

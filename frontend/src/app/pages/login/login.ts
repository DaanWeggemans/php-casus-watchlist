import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../common/services/auth-service';
import { ValidationFormGroup } from '../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../components/validation-formgroup-error/validation-formgroup-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ValidationFormgroupError],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    email: ["", [{ validator: Validators.required }, { validator: Validators.email }]],
    password: ["", [{ validator: Validators.required }]]
  });

  async login() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value();
    const result = await this.authService.login({
      email: value.email,
      password: value.password
    });
    
    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      if (result.status === 401)
        this.formGroup.logError("password", "The email or password is incorrect.");

      this.isLoading.set(false);
      return;
    }

    this.router.navigate(['/feed']);
    this.isLoading.set(false);
  }
}

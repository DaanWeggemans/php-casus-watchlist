import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth-service';
import { ValidationFormgroupError } from '../../components/validation-formgroup-error/validation-formgroup-error';
import { ValidationFormGroup } from '../../common/helpers/validation-form-group';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ValidationFormgroupError],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    username: ["", [{ validator: Validators.required }]],
    email: ["", [{ validator: Validators.required }, { validator: Validators.email }]],
    password: ["", [{ validator: Validators.required }]]
  });

  async register() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value();
    const result = await this.authService.register({
      username: value.username,
      email: value.email,
      password: value.password
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      this.isLoading.set(false);
      return;
    }

    this.router.navigate(['/feed']);
    this.isLoading.set(false);
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../common/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  group = new FormGroup({
    email: new FormControl("", { validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { validators: [Validators.required] })
  });

  error = signal<{
    email: string | undefined,
    password: string | undefined
  }>({ email: undefined, password: undefined });

  async login() {
    const email = this.group.get('email')?.value;
    const password = this.group.get('password')?.value;
    if (!email || !password) {
      const error: {
        email: string[] | undefined,
        password: string[] | undefined
      } = { email: undefined, password: undefined };

      if (!email)
        error.email = ["The email cannot be empty!"];

      if (!password)
        error.password = ["The password cannot be empty!"];

      this.handleError(error);
      return;
    }

    const result = await this.authService.login({
      email: email,
      password: password
    });
    
    if (!result.succeeded) {
      if (result.status === 422)
        this.handleError(result.error);

      if (result.status === 401)
        this.error.set({
          email: undefined,
          password: "De email of het wachtwoord is incorrect!"
        });
      return;
    }

    this.router.navigate(['/feed']);
  }

  handleError(response: any) {
    const error: {
      email: string | undefined,
      password: string | undefined
    } = { email: undefined, password: undefined };

    if (response.email) {
      if (response.email.some((x: string) => x.includes("empty"))) {
        error.email = "De email moet ingevuld zijn!";
      } else if (response.email.some((x: string) => x.includes("valid"))) {
        error.email = "De email moet een geldig e-mailadres zijn!";
      } else error.password = "Er is een onverwachte fout opgetreden!";
    }

    if (response.password) {
      if (response.password.some((x: string) => x.includes("empty"))) {
        error.password = "Het wachtwoord moet ingevuld zijn!";
      } else error.password = "Er is een onverwachte fout opgetreden!";
    }

    this.error.set(error);
  }
}

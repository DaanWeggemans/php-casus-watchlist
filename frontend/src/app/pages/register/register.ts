import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  group = new FormGroup({
    username: new FormControl("", { validators: [Validators.required] }),
    email: new FormControl("", { validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { validators: [Validators.required] })
  });

  error = signal<{
    username: string | undefined,
    email: string | undefined,
    password: string | undefined
  }>({ username: undefined, email: undefined, password: undefined });

  async register() {
    const username = this.group.get('username')?.value;
    const email = this.group.get('email')?.value;
    const password = this.group.get('password')?.value;

    if (!username || !email || !password) {
      const error: {
        username: string[] | undefined,
        email: string[] | undefined,
        password: string[] | undefined
      } = { username: undefined, email: undefined, password: undefined };

      if (!username)
        error.username = ["The password cannot be empty!"];

      if (!email)
        error.email = ["The email cannot be empty!"];

      if (!password)
        error.password = ["The password cannot be empty!"];

      this.handleError(error);
      return;
    }

    const result = await this.authService.register({
      username: username,
      email: email,
      password: password
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.handleError(result.error);

      return;
    }

    this.router.navigate(['/feed']);
  }

  handleError(response: any) {
    const error: {
      username: string | undefined,
      email: string | undefined,
      password: string | undefined
    } = { username: undefined, email: undefined, password: undefined };

    if (response.username) {
      if (response.username.some((x: string) => x.includes("empty"))) {
        error.username = "De username moet ingevuld zijn!";
      } else error.password = "Er is een onverwachte fout opgetreden!";
    }

    if (response.email) {
      if (response.email.some((x: string) => x.includes("empty"))) {
        error.email = "De email moet ingevuld zijn!";
      } else if (response.email.some((x: string) => x.includes("valid"))) {
        error.email = "De email moet een geldig e-mailadres zijn!";
      } else if (response.email.some((x: string) => x.includes("taken"))) {
        error.email = "De email wordt al gebruikt!";
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

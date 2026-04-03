import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../common/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  group = new FormGroup({
    email: new FormControl("", { validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { validators: [Validators.required] })
  });

  async ngOnInit() {
    this.authService.reset();
    console.log(await this.authService.user());
  }

  async login() {
    const email = this.group.get('email')?.value;
    const password = this.group.get('password')?.value;
    if (!email || !password)
      return;

    console.log(await this.authService.login({
      email: email,
      password: password
    }));
    
    console.log(await this.authService.user(), email, password);
  }
}

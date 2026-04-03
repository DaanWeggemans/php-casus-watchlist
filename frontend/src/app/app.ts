import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthClient } from './common/clients/clients';
import { LoginBody, RegisterBody } from './common/interfaces/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  api = inject(AuthClient);

  async ngOnInit() {
    const loginBody: LoginBody = { email: "test@test.com", password: "password" };
    const registerBody: RegisterBody = { username: "Test", email: "test@test.com", password: "password" };
    // console.log(await this.api.login(loginBody));
    // console.log(await this.api.register(registerBody));
    console.log(await this.api.login(loginBody));
    console.log(await this.api.user());
  }
}

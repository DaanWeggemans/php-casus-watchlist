import { RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './common/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  authService = inject(AuthService);

  async ngOnInit() {
    await this.authService.user();
  }
}

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../common/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);

  loggedOut = false;

  async logout() {
    if (this.loggedOut || !this.authService.isAuthorized())
      return;

    this.loggedOut = true;
    this.router.navigate(['/feed']);
    await this.authService.logout();
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WatchlistClient } from '../../../common/clients/clients';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-watchlist',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-watchlist.html',
  styleUrl: './new-watchlist.css',
})
export class NewWatchlist {
  watchlistClient = inject(WatchlistClient);
  router = inject(Router);

  group = new FormGroup({
    name: new FormControl("", [Validators.required])
  });

  error = signal<{
    name: string | undefined
  }>({ name: undefined });

  async create() {
    const name = this.group.get('name')?.value;
    if (!name) {
      this.handleError({
        name: ["The name cannot be empty!"]
      });
      return;
    }

    const result = await this.watchlistClient.createFranchise({
      name: name
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.handleError(result.error);

      return;
    }

    this.router.navigate(['/watchlist']);
  }

  handleError(response: any) {
    const error: {
      name: string | undefined
    } = { name: undefined };

    if (response.name) {
      if (response.name.some((x: string) => x.includes("empty"))) {
        error.name = "De name moet ingevuld zijn!";
      } else error.name = "Er is een onverwachte fout opgetreden!";
    }

    this.error.set(error);
  }
}

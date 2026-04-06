import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { WatchlistClient } from '../../common/clients/clients';
import { RouterLink } from "@angular/router";
import { Franchise } from '../../common/interfaces/franchise';

@Component({
  selector: 'app-watchlist',
  imports: [Header, RouterLink],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  watchlistClient = inject(WatchlistClient);

  items = signal<Franchise[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.watchlistClient.getAllFranchises();
    if (!response.succeeded)
      return;

    this.items.set(response.result);
  }
}

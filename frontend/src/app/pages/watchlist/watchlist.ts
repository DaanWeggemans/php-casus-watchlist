import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { WatchlistClient } from '../../common/clients/clients';

@Component({
  selector: 'app-watchlist',
  imports: [Header],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  watchlistClient = inject(WatchlistClient);

  items = signal<any[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const franchises = await this.watchlistClient.getAllFranchises();
    if (!franchises.succeeded)
      return;

    console.log(franchises.result);
    this.items.set(franchises.result);

    // console.log(await this.watchlistClient.createFranchise({
    //   name: "Franchise3"
    // }));

    // console.log(await this.watchlistClient.deleteFranchise('581d57fb-7c1a-4805-a0a1-9ae81ac9e972'));
  }
}

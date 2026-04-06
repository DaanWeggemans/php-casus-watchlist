import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { WatchlistClient } from '../../common/clients/clients';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-watchlist',
  imports: [Header, RouterLink],
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
    const response = await this.watchlistClient.getAllFranchises();
    if (!response.succeeded)
      return;

    console.log(response.result);
    this.items.set(response.result);
    
    // console.log(await this.watchlistClient.deleteFranchise('7da7b426-7865-4f79-9427-cf2af294e65e'));
    // console.log(await this.watchlistClient.editFranchise('eaae3db4-995c-493c-b4f5-f7a240dc226d', {
    //   index: 1,
    //   name: "Franchise7"
    // }));
  }
}

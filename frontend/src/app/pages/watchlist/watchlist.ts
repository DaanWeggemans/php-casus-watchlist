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
    const response = await this.watchlistClient.getAllFranchises();
    if (!response.succeeded)
      return;

    console.log(response.result);
    this.items.set(response.result);

    // response.result.forEach(async (element: any) => {
    //   console.log(await this.watchlistClient.getFranchise(element.id));
    // });
    // console.log(await this.watchlistClient.createFranchise({
    //   name: "Franchise3"
    // }));
    // console.log(await this.watchlistClient.deleteFranchise('581d57fb-7c1a-4805-a0a1-9ae81ac9e972'));
    // console.log(await this.watchlistClient.editFranchise('27a1c93a-cda7-4edc-b69a-159dc02836be', {
    //   index: 2,
    //   name: "Franchise2"
    // }));
  }
}

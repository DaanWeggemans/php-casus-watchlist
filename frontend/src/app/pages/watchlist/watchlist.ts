import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FranchiseClient, SerieClient } from '../../common/clients/clients';
import { Franchise } from '../../common/interfaces/franchise';

@Component({
  selector: 'app-watchlist',
  imports: [Header],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  franchiseClient = inject(FranchiseClient);
  serieClient = inject(SerieClient);

  items = signal<Franchise[]>([]);
  franchise = signal<Franchise | undefined>(undefined);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.franchiseClient.getAllFranchises();
    if (!response.succeeded)
      return;

    this.items.set(response.result);
  }

  selectFranchise(franchise: Franchise) {
    this.franchise.set(franchise);
  }
}

import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FranchiseClient, SerieClient } from '../../common/clients/clients';
import { Franchise } from '../../common/interfaces/franchise';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NewFranchise } from '../../components/franchise/new-franchise/new-franchise';
import { NewSerie } from '../../components/serie/new-serie/new-serie';
import { Serie } from '../../common/interfaces/serie';

@Component({
  selector: 'app-watchlist',
  imports: [Header, NewFranchise, NewSerie],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  franchiseClient = inject(FranchiseClient);
  activatedRoute = inject(ActivatedRoute);
  serieClient = inject(SerieClient);
  location = inject(Location);

  franchises = signal<Franchise[]>([]);
  series = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  franchise = signal<Franchise | undefined>(undefined);
  serie = signal<Serie | undefined>(undefined);

  isCreateFranchiseOpen = signal<boolean>(false);
  isCreateSerieOpen = signal<boolean>(false);

  ngOnInit() {
    this.getAllFranchises();
  }

  async getAllFranchises() {
    const response = await this.franchiseClient.getAllFranchises();
    if (!response.succeeded)
      return;
    
    this.franchises.set(response.result);
    this.isLoading.set(false);
    await this.selectUrlFranchise();
  }

  async selectUrlFranchise() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!id) return;

    const franchise = this.franchises().find(x => x.id === id);
    if (!franchise) {
      this.closeFranchise();
      return;
    }

    await this.selectFranchise(franchise);
  }

  async selectFranchise(franchise: Franchise) {
    this.location.go(`/watchlist/${franchise.id}`);
    this.franchise.set(franchise);

    this.isLoading.set(true);

    const response = await this.serieClient.getAllSeriesFromFranchise(franchise.id);
    if (!response.succeeded) return;

    this.series.set(response.result);
    this.isLoading.set(false);
  }

  closeFranchise() {
    this.location.go(`/watchlist`);
    this.franchise.set(undefined);
    this.series.set([]);
  }

  selectSerie(serie: Serie) {
    this.serie.set(serie);
  }

  closeSerie() {
    this.serie.set(undefined);
  }

  buttonNew() {
    const result = this.franchise()
      ? this.toggleCreateSerie(undefined)
      : this.toggleCreateFranchise(undefined);
  }

  toggleCreateFranchise(franchise: Franchise | undefined) {
    this.isCreateFranchiseOpen.set(!this.isCreateFranchiseOpen());
    if (franchise) this.franchises.update((value) => [...value, franchise]);
    console.log(franchise);
  }

  toggleCreateSerie(serie: Serie | undefined) {
    this.isCreateSerieOpen.set(!this.isCreateSerieOpen());
    if (serie) this.series.update((value) => [...value, serie]);
    console.log(serie);
  }
}

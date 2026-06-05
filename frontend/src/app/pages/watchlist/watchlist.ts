import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FranchiseClient, SerieClient } from '../../common/clients/clients';
import { Franchise } from '../../common/interfaces/franchise';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NewFranchise } from '../../components/franchise/new-franchise/new-franchise';
import { NewSerie } from '../../components/serie/new-serie/new-serie';

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
  isLoading = signal<boolean>(true);
  franchise = signal<Franchise | undefined>(undefined);

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
    this.selectUrlFranchise();
  }

  selectUrlFranchise() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!id) return;

    const franchise = this.franchises().find(x => x.id === id);
    if (!franchise) {
      this.closeFranchise();
      return;
    }

    this.selectFranchise(franchise);
  }

  selectFranchise(franchise: Franchise) {
    this.location.go(`/watchlist/${franchise.id}`);
    this.franchise.set(franchise);
  }

  closeFranchise() {
    this.location.go(`/watchlist`);
    this.franchise.set(undefined);
  }

  buttonNew() {
    const result = this.franchise()
      ? this.toggleCreateSerie()
      : this.toggleCreateFranchise(undefined);
  }

  toggleCreateFranchise(franchise: Franchise | undefined) {
    this.isCreateFranchiseOpen.set(!this.isCreateFranchiseOpen());
    if (franchise) this.franchises.update((value) => [...value, franchise]);
    console.log(franchise);
  }

  toggleCreateSerie() {
    this.isCreateSerieOpen.set(!this.isCreateSerieOpen());
  }
}

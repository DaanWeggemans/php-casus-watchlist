import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { EpisodeClient, FranchiseClient, SerieClient } from '../../common/clients/clients';
import { Franchise } from '../../common/interfaces/franchise';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NewFranchise } from '../../components/franchise/new-franchise/new-franchise';
import { NewSerie } from '../../components/serie/new-serie/new-serie';
import { Serie } from '../../common/interfaces/serie';
import { SelectedItem } from '../../components/selected-item/selected-item';
import { Episode } from '../../common/interfaces/episode';
import { updateArray } from '../../common/helpers/update-array';

@Component({
  selector: 'app-watchlist',
  imports: [Header, NewFranchise, NewSerie, SelectedItem],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export class Watchlist {
  franchiseClient = inject(FranchiseClient);
  activatedRoute = inject(ActivatedRoute);
  episodeClient = inject(EpisodeClient);
  serieClient = inject(SerieClient);
  location = inject(Location);

  franchises = signal<Franchise[]>([]);
  franchise = signal<Franchise | undefined>(undefined);
  series = signal<Serie[]>([]);
  serie = signal<Serie | undefined>(undefined);
  episodes = signal<Episode[]>([]);
  isLoading = signal<boolean>(true);

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
    this.series.set([]);
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

  async selectSerie(serie: Serie) {
    this.episodes.set([]);
    this.serie.set(serie);
    this.updateEpisodes();
  }

  closeSerie() {
    this.serie.set(undefined);
    this.episodes.set([]);
  }

  buttonNew() {
    this.franchise() !== undefined
      ? this.toggleCreateSerie(undefined)
      : this.toggleCreateFranchise(undefined);
  }

  toggleCreateFranchise(franchise: Franchise | undefined) {
    this.isCreateFranchiseOpen.set(!this.isCreateFranchiseOpen());
    if (!franchise) return;

    this.franchises.update((value) => [...value, franchise]);
  }

  toggleCreateSerie(serie: Serie | undefined) {
    this.isCreateSerieOpen.set(!this.isCreateSerieOpen());
    if (!serie) return;

    this.series.update((value) => [...value, serie]);
    if (!serie.image) return;

    this.franchises.update((value) => {
      const franchise = value.find(franchise => franchise.id === this.franchise()?.id);
      if (franchise) franchise.image = serie.image;

      return value;
    });
  }

  updateFranchise(franchise: Franchise) {
    this.franchises.set(updateArray(franchise, this.franchises()).sort((a: Franchise, b: Franchise) => {
      return a.index - b.index;
    }));

    this.franchise.set(franchise);
  }

  updateSerie(serie: Serie) {
    this.series.set(updateArray(serie, this.series()).sort((a: Serie, b: Serie) => {
      return a.index - b.index;
    }));

    this.franchises.update((value) => {
      return value.map((franchise) => {
        if (franchise.id == this.franchise()?.id) {
          const series = this.series().filter((serie) => serie.image);
          franchise.image = series.length ? series[series.length - 1].image : null;
        }

        return franchise;
      });
    });

    this.serie.set(serie);
  }

  updateEpisode(episode: Episode) {
    this.episodes.set(updateArray(episode, this.episodes()).sort((a: Episode, b: Episode) => {
      return a.index - b.index;
    }));
  }

  async updateEpisodes() {
    const serie = this.serie();
    if (!serie || serie.type !== "serie") return;

    const response = await this.episodeClient.getAllEpisodesFromSerie(serie.id);
    if (!response.succeeded) return;

    this.episodes.set(response.result);
  }
}

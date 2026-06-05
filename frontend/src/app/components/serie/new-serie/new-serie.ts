import { Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { EpisodeClient, SerieClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';
import { Serie } from '../../../common/interfaces/serie';

@Component({
  selector: 'app-new-serie',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './new-serie.html',
  styleUrl: './new-serie.css',
})
export class NewSerie {
  episodeClient = inject(EpisodeClient);
  serieClient = inject(SerieClient);

  close = output<Serie | undefined>();
  franchise_id = input<string>();

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]],
    type: ["", [{ validator: Validators.required }]],
    done: [false, []],
    season: [0, []],
    episodes: [0, []],
    file: [null, []],
  });

  async create() {
    this.formGroup.errors.set({});
    if (this.isLoading() || !this.formGroup.validate())
      return;

    this.isLoading.set(true);
    const value = this.formGroup.value;
    const file = value.file as File | null;
    const franchise_id = this.franchise_id();

    if (!franchise_id) {
      this.close.emit(undefined);
      return;
    }

    if (value.type == "serie" && (value.season < 1 || value.episodes < 1)) {
      if (value.season < 1)
        this.formGroup.logError("season", "The season must be at least 1.");
      
      if (value.episodes < 1)
        this.formGroup.logError("episodes", "The amount of episodes must be at least 1.");

      this.isLoading.set(false);
      return;
    }

    const response = await this.serieClient.createSerie({
      name: value.name,
      type: value.type,
      done: value.done,
      image: file,
      season: value.type == "serie" ? value.season : null,
      franchise_id: franchise_id
    });

    if (!response.succeeded) {
      if (response.status === 422)
        this.formGroup.logLaravelErrors(response.error);

      this.isLoading.set(false);
      return;
    }

    if (value.type == "serie") {
      const episodes = [];
      for (let i = 0; i < value.episodes; i++)
        episodes.push({ name: null });

      await this.episodeClient.createEpisodes({
        serie_id: response.result.id,
        episodes: episodes
      });
    }

    this.close.emit(response.result);
    this.isLoading.set(false);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    this.formGroup.group.patchValue({
      file: file
    });
  }
}

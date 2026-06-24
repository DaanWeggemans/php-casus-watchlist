import { Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { EpisodeClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../validation-formgroup-error/validation-formgroup-error';
import { Episode } from '../../../common/interfaces/episode';

@Component({
  selector: 'app-new-episode',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './new-episode.html',
  styleUrl: './new-episode.css',
})
export class NewEpisode {
  private readonly episodeClient = inject(EpisodeClient);

  serie_id = input<string>();
  close = output<Episode[] | undefined>();

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    episodes: [1, [{ validator: Validators.required }, { validator: Validators.min(1) }]]
  });

  async create() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value;
    const serie_id = this.serie_id();

    if (!serie_id) {
      this.close.emit(undefined);
      return;
    }

    const episodes = [];
      for (let i = 0; i < value.episodes; i++)
        episodes.push({ name: null });

    const result = await this.episodeClient.createEpisodes({
      serie_id: serie_id,
      episodes: episodes
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      this.isLoading.set(false);
      return;
    }

    this.close.emit(result.result);
    this.isLoading.set(false);
  }
}

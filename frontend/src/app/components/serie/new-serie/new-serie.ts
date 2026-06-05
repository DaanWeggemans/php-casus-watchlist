import { Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { EpisodeClient, SerieClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';

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

  close = output();
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
    if (this.isLoading() || !this.formGroup.validate())
      return;

    this.isLoading.set(true);
    const value = this.formGroup.value();
    const file = value.file as File | null;
    const franchise_id = this.franchise_id();

    if (!franchise_id) {
      this.close.emit();
      return;
    }

    let result = await this.serieClient.createSerie({
      name: value.name,
      type: value.type,
      done: value.done,
      image: file,
      season: value.type == "serie" ? value.season : null,
      franchise_id: franchise_id
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      this.isLoading.set(false);
      return;
    }

    const episodes = [];
    for (let i = 0; i < value.episodes; i++)
      episodes.push({ name: null });

    result = await this.episodeClient.createEpisodes({
      serie_id: result.result.id,
      episodes: episodes
    });

    if (!result.succeeded) {
      this.isLoading.set(false);
      return;
    }

    this.close.emit();
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

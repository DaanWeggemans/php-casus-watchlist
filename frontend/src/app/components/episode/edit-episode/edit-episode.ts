import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpisodeClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../validation-formgroup-error/validation-formgroup-error';
import { EditEpisodeRequest, Episode } from '../../../common/interfaces/episode';

@Component({
  selector: 'app-edit-episode',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './edit-episode.html',
  styleUrl: './edit-episode.css',
})
export class EditEpisode implements OnInit {
  private readonly episodeClient = inject(EpisodeClient);

  episode = input<Episode>();
  serie_id = input<string>();
  close = output<Episode | undefined>();
  closeAndDelete = output();

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", []],
    done: [false, []],
    index: [1, []]
  });

  ngOnInit() {
    const episode = this.episode();
    if (!episode) return;

    this.formGroup.group.patchValue({
      name: episode.name ?? "",
      done: episode.done,
      index: episode.index
    });
  }

  async edit() {
    this.formGroup.errors.set({});
    if (this.isLoading() || !this.formGroup.validate())
      return;

    const episode = this.episode();
    if (!episode) {
      this.close.emit(undefined);
      return;
    }

    this.isLoading.set(true);
    const value = this.formGroup.value;

    const request: EditEpisodeRequest = { };
    if ((episode.name ?? "") != value.name)
      request['name'] = value.name.length ? value.name : null;
    if (episode.done != value.done)
      request['done'] = value.done;
    if (episode.index != value.index) {
      request['index'] = value.index;
      request['serie_id'] = this.serie_id()
    }

    const response = await this.episodeClient.editEpisode(episode.id, request);
    if (!response.succeeded) {
      if (response.status === 422)
        this.formGroup.logLaravelErrors(response.error);

      this.isLoading.set(false);
      return;
    }

    this.close.emit({
      id: episode.id,
      name: value.name.length ? value.name : null,
      done: value.done,
      index: value.index,
    });

    this.isLoading.set(false);
  }

  async delete() {
    if (this.isLoading())
      return;

    const episode = this.episode();
    if (!episode) {
      this.close.emit(undefined);
      return;
    }

    this.isLoading.set(true);
    const response = await this.episodeClient.deleteEpisode(episode.id);
    if (!response.succeeded) return;

    this.closeAndDelete.emit();
    this.isLoading.set(false);
  }
}

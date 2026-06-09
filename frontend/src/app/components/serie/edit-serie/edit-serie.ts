import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EditSerieRequest, Serie } from '../../../common/interfaces/serie';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../validation-formgroup-error/validation-formgroup-error';
import { ReactiveFormsModule } from '@angular/forms';
import { SerieClient } from '../../../common/clients/clients';
import { fileToBase64 } from '../../../common/helpers/file-to-base64';

@Component({
  selector: 'app-edit-serie',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './edit-serie.html',
  styleUrl: './edit-serie.css',
})
export class EditSerie implements OnInit {
  serieClient = inject(SerieClient);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", []],
    season: [1, []],
    done: [false, []],
    file: [null, []],
    index: [1, []]
  });

  serie = input<Serie>();
  franchise_id = input<string>();
  close = output<Serie | undefined>();

  ngOnInit() {
    const serie = this.serie();
    if (!serie) return;

    this.formGroup.group.patchValue({
      name: serie.name,
      season: serie.season,
      done: serie.done,
      index: serie.index
    });
  }

  async edit() {
    if (this.isLoading() || !this.formGroup.validate())
      return;

    const serie = this.serie();
    if (!serie) {
      this.close.emit(undefined);
      return;
    }

    this.isLoading.set(true);
    const value = this.formGroup.value;
    const request: EditSerieRequest = { };
    if ((serie.name ?? "") != value.name)
      request['name'] = value.name.length ? value.name : null;
    if (serie.type == 'serie' && serie.season != value.season)
      request['season'] = value.season;
    if (serie.done != value.done)
      request['done'] = value.done;
    if (serie.image == null && value.file != null)
      request['image'] = value.file;
    if (serie.index != value.index) {
      request['index'] = value.index;
      request['franchise_id'] = this.franchise_id()
    }

    const response = await this.serieClient.editSerie(serie.id, request);
    if (!response.succeeded) {
      if (response.status === 422)
        this.formGroup.logLaravelErrors(response.error);

      this.isLoading.set(false);
      return;
    }

    this.close.emit({
      id: serie.id,
      name: value.name,
      type: serie.type,
      done: value.done,
      season: value.type == "serie" ? value.season : null,
      image: await fileToBase64(value.file),
      index: value.index,
    });

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

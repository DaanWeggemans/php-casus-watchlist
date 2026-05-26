import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { SerieClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';

@Component({
  selector: 'app-new-serie',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './new-serie.html',
  styleUrl: './new-serie.css',
})
export class NewSerie {
  serieClient = inject(SerieClient);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]],
    type: ["", [{ validator: Validators.required }]],
    done: [false, [{ validator: Validators.required }]],
    season: [0, []],
    file: [null, []],
  });

  async create() {
    if (this.isLoading() || !this.formGroup.validate())
      return;

    this.isLoading.set(true);
    const value = this.formGroup.value();
    const file = value.file as File | null;
    const result = await this.serieClient.createSerie({
      name: value.name,
      type: value.type,
      done: value.done,
      image: file,
      season: value.type == "serie" ? value.season : null,
      franchise_id: "734b8512-5f7f-4c78-8346-1b1ffffbab5f"
    });

    if (!result.succeeded)
      this.formGroup.logLaravelErrors(result.error);

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

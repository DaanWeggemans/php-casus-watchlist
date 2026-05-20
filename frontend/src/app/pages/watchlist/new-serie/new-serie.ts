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
    file: [null, []],
  });

  async ngOnInit() {
    console.log(await this.serieClient.getAllSeries());
    // console.log(await this.serieClient.getAllSeriesFromFranchise("27a1c93a-cda7-4edc-b69a-159dc02836be"));
    console.log(await this.serieClient.getAllSeriesFromFranchise("734b8512-5f7f-4c78-8346-1b1ffffbab5f"));
  }

  async create() {
    if (this.isLoading() || !this.formGroup.validate())
      return;

    this.isLoading.set(true);
    const value = this.formGroup.value;
    const file = value.file as File | null;
    console.log(value);
    console.log(await this.serieClient.createSerie({
      name: value.name,
      type: value.type,
      done: value.done,
      image: file,
      season: null,
      franchise_id: "734b8512-5f7f-4c78-8346-1b1ffffbab5f"
    }));

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

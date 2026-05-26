import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { SerieClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-new-serie',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './new-serie.html',
  styleUrl: './new-serie.css',
})
export class NewSerie {
  activatedRoute = inject(ActivatedRoute);
  serieClient = inject(SerieClient);
  router = inject(Router);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]],
    type: ["", [{ validator: Validators.required }]],
    done: [false, []],
    season: [0, []],
    file: [null, []],
  });

  async create() {
    if (this.isLoading() || !this.formGroup.validate())
      return;

    this.isLoading.set(true);
    const value = this.formGroup.value();
    const file = value.file as File | null;
    const franchise_id = (await firstValueFrom(this.activatedRoute.paramMap)).get("franchise_id");
    if (!franchise_id) {
      this.router.navigate(['/watchlist']);
      return;
    }

    const result = await this.serieClient.createSerie({
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

    this.router.navigate([`/watchlist/${franchise_id}`]);
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

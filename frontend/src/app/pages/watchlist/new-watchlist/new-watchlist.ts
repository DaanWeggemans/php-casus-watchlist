import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseClient } from '../../../common/clients/clients';
import { Router, RouterLink } from '@angular/router';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';

@Component({
  selector: 'app-new-watchlist',
  imports: [ReactiveFormsModule, RouterLink, ValidationFormgroupError],
  templateUrl: './new-watchlist.html',
  styleUrl: './new-watchlist.css',
})
export class NewWatchlist {
  watchlistClient = inject(FranchiseClient);
  router = inject(Router);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]]
  });

  async create() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value();
    const result = await this.watchlistClient.createFranchise({
      name: value.name
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      this.isLoading.set(false);
      return;
    }

    this.router.navigate(['/watchlist']);
    this.isLoading.set(false);
  }
}

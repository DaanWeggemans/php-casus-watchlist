import { Component, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseClient } from '../../../common/clients/clients';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../validation-formgroup-error/validation-formgroup-error';
import { Franchise } from '../../../common/interfaces/franchise';

@Component({
  selector: 'app-new-franchise',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './new-franchise.html',
  styleUrl: './new-franchise.css',
})
export class NewFranchise {
  franchiseClient = inject(FranchiseClient);

  close = output<Franchise | undefined>();

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]]
  });

  async create() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value();
    const result = await this.franchiseClient.createFranchise({
      name: value.name
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

import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FranchiseClient } from '../../../common/clients/clients';
import { ReactiveFormsModule } from '@angular/forms';
import { Franchise } from '../../../common/interfaces/franchise';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../validation-formgroup-error/validation-formgroup-error';

@Component({
  selector: 'app-edit-franchise',
  imports: [ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './edit-franchise.html',
  styleUrl: './edit-franchise.css',
})
export class EditFranchise implements OnInit {
  franchiseClient = inject(FranchiseClient);

  isLoading = signal<boolean>(false);
  formGroup = new ValidationFormGroup({
    name: ["", []],
    index: [1, []]
  });

  franchise = input<Franchise>();
  close = output<Franchise | undefined>();

  ngOnInit() {
    const franchise = this.franchise();
    if (!franchise) return;

    this.formGroup.group.patchValue({
      name: franchise.name,
      index: franchise.index
    });
  }

  async edit() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const franchise = this.franchise();
    if (!franchise) {
      this.close.emit(undefined);
      return;
    }

    const value = this.formGroup.value;
    const result = await this.franchiseClient.editFranchise(franchise.id, {
      name: value.name,
      index: value.index
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.formGroup.logLaravelErrors(result.error);

      this.close.emit(undefined);
      this.isLoading.set(false);
      return;
    }

    this.close.emit({
      id: franchise.id,
      image: franchise.image,
      name: value.name,
      index: value.index
    });

    this.isLoading.set(false);
  }
}

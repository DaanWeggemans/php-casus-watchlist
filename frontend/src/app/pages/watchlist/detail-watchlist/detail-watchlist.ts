import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Header } from '../../../components/header/header';
import { FranchiseClient } from '../../../common/clients/clients';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Franchise } from '../../../common/interfaces/franchise';
import { ValidationFormGroup } from '../../../common/helpers/validation-form-group';
import { ValidationFormgroupError } from '../../../components/validation-formgroup-error/validation-formgroup-error';

@Component({
  selector: 'app-detail-watchlist',
  imports: [Header, ReactiveFormsModule, ValidationFormgroupError],
  templateUrl: './detail-watchlist.html',
  styleUrl: './detail-watchlist.css',
})
export class DetailWatchlist implements OnInit {
  franchiseClient = inject(FranchiseClient);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  isLoading = signal<boolean>(true);
  formGroup = new ValidationFormGroup({
    name: ["", [{ validator: Validators.required }]],
    index: [1, [{ validator: Validators.required }, { validator: Validators.min(1) }]]
  });

  franchise = signal<Franchise | undefined>(undefined);

  ngOnInit() {
    this.get();
  }

  async get() {
    const id = (await firstValueFrom(this.activatedRoute.paramMap)).get("id") ?? "";
    const result = await this.franchiseClient.getFranchise(id);
    if (!result.succeeded) {
      this.router.navigate(['/watchlist']);
      this.isLoading.set(false);
      return;
    }

    this.franchise.set(result.result);
    this.formGroup.group.patchValue({
      name: this.franchise()!.name,
      index: this.franchise()!.index
    });
    this.isLoading.set(false);
  }

  async submit(event: SubmitEvent) {
    if (!event.submitter)
      return;

    const type = (event.submitter as HTMLInputElement).defaultValue;
    switch (type) {
      case "Update":
        await this.update();
        break;
      case "Delete":
        await this.delete();
        break;
      default:
        this.router.navigate(['/watchlist']);
    }
  }

  async update() {
    if (this.isLoading() || !this.formGroup.validate()) return;
    this.isLoading.set(true);

    const value = this.formGroup.value();
    const result = await this.franchiseClient.editFranchise(this.franchise()!.id, {
      name: value.name,
      index: value.index
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

  async delete() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const result = await this.franchiseClient.deleteFranchise(this.franchise()!.id);
    if (!result.succeeded) {
      this.isLoading.set(false);
      return;
    }

    this.router.navigate(['/watchlist']);
    this.isLoading.set(false);
  }
}

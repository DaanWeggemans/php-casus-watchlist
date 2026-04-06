import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Header } from '../../../components/header/header';
import { WatchlistClient } from '../../../common/clients/clients';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-watchlist',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './detail-watchlist.html',
  styleUrl: './detail-watchlist.css',
})
export class DetailWatchlist implements OnInit {
  watchlistClient = inject(WatchlistClient);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  group = new FormGroup({
    name: new FormControl("", [Validators.required]),
    index: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  franchise = signal<any>({});
  error = signal<{
    name: string | undefined,
    index: string | undefined
  }>({ name: undefined, index: undefined });

  ngOnInit() {
    this.get();
  }

  async get() {
    const id = (await firstValueFrom(this.activatedRoute.paramMap)).get("id") ?? "";
    const result = await this.watchlistClient.getFranchise(id);
    if (!result.succeeded) {
      this.router.navigate(['/watchlist']);
      return;
    }

    this.franchise.set(result.result);
    this.group.patchValue({
      name: this.franchise().name,
      index: this.franchise().index
    });
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
    const name = this.group.get('name')?.value;
    const index = this.group.get('index')?.value;
    if (!name || !index) {
      const error: {
        name: string[] | undefined,
        index: string[] | undefined
      } = { name: undefined, index: undefined };

      if (!name)
        error.name = ["The name cannot be empty!"];
      
      if (!index)
        error.index = ["The index cannot be empty!"];
      
      this.handleError(error);
      return;
    }

    const result = await this.watchlistClient.editFranchise(this.franchise().id, {
      name: name,
      index: index
    });

    if (!result.succeeded) {
      if (result.status === 422)
        this.handleError(result.error);

      return;
    }

    this.router.navigate(['/watchlist']);
  }

  async delete() {
    const result = await this.watchlistClient.deleteFranchise(this.franchise().id);
    if (!result.succeeded)
      return;

    this.router.navigate(['/watchlist']);
  }

  handleError(response: any) {
    const error: {
      name: string | undefined,
      index: string | undefined
    } = { name: undefined, index: undefined };

    if (response.name) {
      if (response.name.some((x: string) => x.includes("empty"))) {
        error.name = "De naam moet ingevuld zijn!";
      } else error.name = "Er is een onverwachte fout opgetreden!";
    }

    if (response.index) {
      if (response.index.some((x: string) => x.includes("empty"))) {
        error.index = "De index moet ingevuld zijn!";
      } else if (response.index.some((x: string) => x.includes("at least 1"))) {
        error.index = "De index moet in ieder geval 1 zijn!";
      } else error.index = "Er is een onverwachte fout opgetreden!";
    }

    this.error.set(error);
  }
}

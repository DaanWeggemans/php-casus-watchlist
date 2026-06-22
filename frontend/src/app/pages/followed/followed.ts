import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FeedClient } from '../../common/clients/clients';
import { Feeds } from '../../common/interfaces/feed';

@Component({
  selector: 'app-followed',
  imports: [Header],
  templateUrl: './followed.html',
  styleUrl: './followed.css',
})
export class Followed {
  private readonly feedClient = inject(FeedClient);

  feeds = signal<Feeds[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.feedClient.getFollowedFeed();
    if (!response.succeeded) return;

    this.feeds.set(response.result);
  }
}

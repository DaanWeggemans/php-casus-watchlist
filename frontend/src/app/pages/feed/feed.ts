import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FeedClient } from '../../common/clients/clients';
import { Feeds } from '../../common/interfaces/feed';

@Component({
  selector: 'app-feed',
  imports: [Header],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  feedClient = inject(FeedClient);

  feeds = signal<Feeds[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.feedClient.getFeed();
    if (!response.succeeded) return;

    this.feeds.set(response.result);
  }
}

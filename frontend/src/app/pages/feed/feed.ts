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
  private readonly feedClient = inject(FeedClient);

  feeds = signal<Feeds[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.feedClient.getFeed();
    if (!response.succeeded) return;

    this.feeds.set(response.result);
  }

  toReadable(date: Date) {
    const day = date.getDay().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  async toggleFollow(feed: Feeds) {
    const response = feed.user.is_followed
      ? await this.feedClient.removeFollowed(feed.user.id)
      : await this.feedClient.createFollowed(feed.user.id);

    if (!response.succeeded) return;
    this.feeds.update((array) => array.map(x => {
      if (x.id != feed.id) return x;
      x.user.is_followed = !x.user.is_followed;
      return x;
    }));
  }
}

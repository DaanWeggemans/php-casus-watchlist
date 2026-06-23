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

  isLoading = signal<boolean>(true);
  feeds = signal<Feeds[]>([]);

  ngOnInit() {
    this.get();
  }

  async get() {
    const response = await this.feedClient.getFollowedFeed();
    if (!response.succeeded) return;

    this.feeds.set(response.result);
    this.isLoading.set(false);
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
    }).filter(x => x.user.is_followed));
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { FeedClient } from '../../common/clients/clients';
import { Feeds } from '../../common/interfaces/feed';
import { AuthService } from '../../common/services/auth-service';
import { User } from '../../common/interfaces/user';

@Component({
  selector: 'app-feed',
  imports: [Header],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  private readonly feedClient = inject(FeedClient);
  readonly authService = inject(AuthService);

  feeds = signal<Feeds[]>([]);
  isLoading = signal<boolean>(true);
  user = signal<User | undefined>(undefined);

  ngOnInit() {
    this.getUser();
    this.get();
  }

  async get() {
    const response = await this.feedClient.getFeed();
    if (!response.succeeded) return;

    this.feeds.set(response.result);
    this.isLoading.set(false);
  }

  async getUser() {
    const user = await this.authService.user();
    this.user.set(user);
  }

  async toggleFollow(feed: Feeds) {
    const response = feed.user.is_followed
      ? await this.feedClient.removeFollowed(feed.user.id)
      : await this.feedClient.createFollowed(feed.user.id);

    if (!response.succeeded) return;
    this.feeds.update((array) => array.map(x => {
      if (x.user.id != feed.user.id) return x;
      x.user.is_followed = !x.user.is_followed;
      return x;
    }));
  }

  getTitle(feed: Feeds) {
    return `${ feed.user.username } has shared a ${ feed.serie.type }: ${ feed.serie.name }`;
  }

  getDescription(feed: Feeds) {
    return `${ feed.user.username } has finished ${ feed.serie.name }`;
  }

  toReadable(date: Date) {
    const day = date.getDay().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}

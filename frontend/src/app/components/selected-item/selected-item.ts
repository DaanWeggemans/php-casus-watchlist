import { Component, input, output, signal } from '@angular/core';
import { Serie } from '../../common/interfaces/serie';
import { Franchise } from '../../common/interfaces/franchise';
import { Episode } from '../../common/interfaces/episode';
import { EditEpisode } from '../episode/edit-episode/edit-episode';

@Component({
  selector: 'app-selected-item',
  standalone: true,
  imports: [EditEpisode],
  templateUrl: './selected-item.html',
  styleUrl: './selected-item.css',
})
export class SelectedItem {
  item = input<Franchise | Serie>();
  episodes = input<Episode[]>();

  close = output();
  updateEpisode = output<Episode>();

  isEditEpisodeOpen = signal<boolean>(false);
  episode = signal<Episode | undefined>(undefined);

  openEpisode(episode: Episode) {
    this.isEditEpisodeOpen.set(!this.isEditEpisodeOpen());
    this.episode.set(episode);
  }

  closeEpisode(episode: Episode | undefined) {
    this.isEditEpisodeOpen.set(false);
    this.episode.set(undefined);
    if (episode) this.updateEpisode.emit(episode);
  }
}

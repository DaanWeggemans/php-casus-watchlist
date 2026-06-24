import { Component, computed, input, output, signal } from '@angular/core';
import { Serie } from '../../common/interfaces/serie';
import { Franchise } from '../../common/interfaces/franchise';
import { Episode } from '../../common/interfaces/episode';
import { EditEpisode } from '../episode/edit-episode/edit-episode';
import { EditSerie } from '../serie/edit-serie/edit-serie';
import { EditFranchise } from '../franchise/edit-franchise/edit-franchise';
import { updateArray } from '../../common/helpers/update-array';

@Component({
  selector: 'app-selected-item',
  standalone: true,
  imports: [EditEpisode, EditSerie, EditFranchise],
  templateUrl: './selected-item.html',
  styleUrl: './selected-item.css',
})
export class SelectedItem {
  item = input<Franchise | Serie>();
  episodes = input<Episode[]>();
  type = input<string>();
  franchise_id = input<string>();

  close = output();
  toggleVisibility = output();
  updateSerie = output<Serie>();
  updateFranchise = output<Franchise>();
  updateEpisode = output<Episode>();
  deleteItem = output();
  deleteEpisode = output<Episode>();
  createEpisode = output();

  isEditItemOpen = signal<boolean>(false);
  isEditEpisodeOpen = signal<boolean>(false);
  episode = signal<Episode | undefined>(undefined);

  itemAsFranchise = computed<Franchise>(() => this.item() as Franchise);
  itemAsSerie = computed<Serie>(() => this.item() as Serie);

  openEpisode(episode: Episode) {
    this.isEditEpisodeOpen.set(true);
    this.episode.set(episode);
  }

  closeEpisode(episode: Episode | undefined) {
    this.isEditEpisodeOpen.set(false);
    this.episode.set(undefined);
    if (episode) this.updateEpisode.emit(episode);
  }

  openItem() {
    console.log(this.itemAsSerie());
    if (this.type() != 'Franchise' && this.type() != 'Serie') return;
    this.isEditItemOpen.set(true);
  }

  closeItem(item: Franchise | Serie | undefined) {
    this.isEditItemOpen.set(false);
    if (item) {
      if (this.type() == 'Serie') {
        this.updateSerie.emit(item as Serie);
      } else if (this.type() == 'Franchise') {
        this.updateFranchise.emit(item as Franchise);
      }
    }
  }

  getType() {
    const type = (this.type() == 'Franchise' ? this.type() : this.itemAsSerie().type) ?? "";
    return type.toLowerCase();;
  }

  emitDeleteItem() {
    if (!confirm(`Are you sure you want to delete this ${this.getType()}?`))
      return;

    this.deleteItem.emit();
  }

  emitDeleteEpisode() {
    const episode = this.episode();
    if (episode) this.deleteEpisode.emit(episode);
    this.closeEpisode(undefined);
  }
}

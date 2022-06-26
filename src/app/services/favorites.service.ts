import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  public favIDs: Array<number>;
  public favTours: Array<any>;
  private _storage: Storage;

  constructor(private storage: Storage) { }

  async initialize(tours) {
    this._storage = await this.storage.create();
    this.favIDs = (await this._storage.get('FavoritesIDs')) ?? [];
    this.favTours = tours.filter(tour => this.favIDs.includes(tour.ID));
  }

  add(tour) {
    this.favIDs.push(tour.ID);
    this.favTours.push(tour);
    this._storage.set('FavoritesIDs', this.favIDs);
  }

  remove(tour) {
    const removeIndex: number = this.favIDs.indexOf(tour.ID);
    if(removeIndex !== -1) {
      this.favIDs.splice(removeIndex, 1);
      this.favTours.splice(removeIndex, 1);
      this._storage.set('FavoritesIDs', this.favIDs);
    }
  }

  reorder(event){
    event.detail.complete(this.favTours);
    this.favIDs = this.favTours.map(tour => tour.ID);
    this._storage.set('FavoritesIDs', this.favIDs);
  }
}

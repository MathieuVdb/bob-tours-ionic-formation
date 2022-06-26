import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import { FavoritesService } from './favorites.service';
import { LoadingController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class BobToursService {

  public regions: any;
  public tourtypes: any;
  public tours: any;
  public allTours: any;

  baseUrl = 'https://bob-tours-app-4f5ff-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(private http: HttpClient,
              public favService: FavoritesService,
              private loadingCtrl: LoadingController) { }

  async initalize() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading tour data...',
      spinner: 'crescent'
    });
    await loading.present();
    this.getRegions().then(data => this.regions = data);
    this.getTourTypes().then(data => this.tourtypes = _.sortBy(data, 'Name'));
    this.getTours().then(data => {
      this.tours = _.sortBy(data, 'Title');
      this.allTours = _.sortBy(data, 'Title');
      this.filterTours({lower:80, upper:400});
      this.favService.initialize(this.allTours);
    });
    loading.dismiss();
  }

  getRegions() {
    const requestUrl = `${this.baseUrl}/Regions.json`;
    return this.http.get(requestUrl).toPromise();
  }

  getTourTypes() {
    const requestUrl = `${this.baseUrl}/Tourtypes.json`;
    return this.http.get(requestUrl).toPromise();
  }

  getTours() {
    const requestUrl = `${this.baseUrl}/Tours.json`;
    return this.http.get(requestUrl).toPromise();
  }

  filterTours(price): number{
    this.tours = _.filter(this.allTours, function(tour) {
      return tour.PriceG >= price.lower
        && tour.PriceG <= price.upper;
    });
    this.regions.forEach(region => {
      const rtours = _.filter(this.tours, ['Region', region.ID]);
      region['Count'] = rtours.length;
    });
    this.tourtypes.forEach(tourtype => {
      const ttours = _.filter(this.tours, ['Tourtype', tourtype.ID]);
      tourtype['Count'] = ttours.length;
    });
    return this.tours.length;
  }
}

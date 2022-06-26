import { Component, OnInit } from '@angular/core';
import { BobToursService } from 'src/app/services/bob-tours.service';
import _ from 'lodash';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.page.html',
  styleUrls: ['./regions.page.scss'],
})
export class RegionsPage implements OnInit {

  //public regions: any;

  constructor(public btService: BobToursService) { }

  ngOnInit() {
    /*this.regions = this.btService.regions;
    this.regions.forEach(region => {
      const tours = _.filter(this.btService.tours, ['Region', region.ID]);
      region.Count = tours.length;
    });*/
  }

}

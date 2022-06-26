import { Component, OnInit } from '@angular/core';
import { BobToursService } from 'src/app/services/bob-tours.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {

  sliderConfig = {
    centeredSlides: true,
    autoplay: { delay: 2400 },
    loop: true
  };

  constructor(public btService: BobToursService) { }

  ngOnInit() {
  }

  manageFavorite(tour) {
    if(!this.isFavorite(tour)) {
      this.btService.favService.add(tour);
    }else {
      this.btService.favService.remove(tour);
    }
  }

  isFavorite(tour) {
    return this.btService.favService.favIDs.indexOf(parseInt(tour.ID, 10)) !== -1;
  }

}

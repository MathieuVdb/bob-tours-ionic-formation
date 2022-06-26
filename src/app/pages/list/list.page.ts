import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BobToursService } from 'src/app/services/bob-tours.service';
import _ from 'lodash';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  tours: any;
  selection: any;

  constructor(public btService: BobToursService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.selection = this.activatedRoute.snapshot.params;
    const category = this.selection.Category;
    const criteria = this.selection.Criteria;
    this.tours = _.filter(
      this.btService.tours, [category, criteria]
    );
  }

  search(ev) {
    const searchText = ev.detail.value;
    this.tours = _.filter(this.btService.tours, [this.selection.Category, this.selection.Criteria]);
    if(searchText !== ''){
      this.tours = this.tours.filter((tour) => {
        return (tour.Title.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      });
    }
  }

}

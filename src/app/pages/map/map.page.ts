import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  currentView = 'map';

  tour: any = {};
  map: any;
  position: any;
  destination: any;
  isCalculated: boolean;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.initMap();
  }

  // Initialize map
  initMap() {
    this.tour = this.navParams.data;
    this.destination = new google.maps.LatLng(
      this.tour.StartingPoint.Lat,
      this.tour.StartingPoint.Lng
    );
    this.map = new
      google.maps.Map(document.getElementById('map'), {
        center: this.destination,
        zoom: 16,
        fullscreenControl: false
      });
    this.isCalculated = false;
    this.addDestinationMarker();
  }

  // Calculates a route from current user position to destination
  async calcRoute() {

    if (this.isCalculated) return;

    // Show calculation process
    const loading = await this.loadingCtrl.create({
      message: 'Calculate route...',
      spinner: 'crescent'
    });
    await loading.present();

    // Get current user position
    const geo = await this.geolocation.getCurrentPosition();
    this.position = new google.maps.LatLng(
      geo.coords.latitude,
      geo.coords.longitude
    );

    // Prepare map and description display
    const dirDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    dirDisplay.setMap(this.map);
    dirDisplay.setPanel(document.getElementById('description'));

    // Calculate route from position to destination
    const dirService = new google.maps.DirectionsService();
    dirService.route({
      origin: this.position,
      destination: this.destination,
      travelMode: 'DRIVING'
    },
      function (result, status) {
        if (status == 'OK') {
          dirDisplay.setDirections(result);
        }
      });

    // Add position marker
    this.addPositionMarker();

    // Calculation process finished
    this.isCalculated = true;
    loading.dismiss();
  }

  // Add current position marker
  addPositionMarker() {

    // icon
    const iconCar = {
      url: 'https://ionic.andreas-dormann.de/img/car-point.svg',
      scaledSize: new google.maps.Size(96, 96)
    }

    // marker
    const marker = new google.maps.Marker({
      position: this.position,
      map: this.map,
      icon: iconCar
    });

  }

  // Add destination marker
  addDestinationMarker() {

    // icon
    const iconSun = {
      url: 'https://ionic.andreas-dormann.de/img/sun-point.svg',
      scaledSize: new google.maps.Size(96, 96)
    }

    // marker
    const marker = new google.maps.Marker({
      position: this.destination,
      map: this.map,
      icon: iconSun
    });

    // information window
    const infoWindow = new google.maps.InfoWindow({
      content: '<h3>' + this.tour.Title + '</h3>' +
        '<p>Starting point of the tour:<br />' +
        this.tour.StartingPoint.Location + '</p>',
      maxWidth: 200
    })

    // click handler
    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });

  }

  // User changed a segment
  currentViewChanged(ev) {
    switch (ev.detail.value) {
      case 'map': this.initMap(); break;
      case 'route': this.calcRoute(); break;
      case 'description': this.calcRoute(); break;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}

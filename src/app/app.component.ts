import { Component } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { AboutComponent } from './components/about/about.component';
import { BobToursService } from './services/bob-tours.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Favorites', url: '/favorites', icon: 'star' },
    { title: 'Regions', url: '/regions', icon: 'images' },
    { title: 'Tour-Types', url: '/tour-types', icon: 'bus' },
    { title: 'Slideshow', url: '/slideshow', icon: 'play' },
  ];

  settings: any = {};
  private _storage: Storage;

  price: any = { lower: 80, upper: 400 };
  hits: number = 24;

  constructor(public btService: BobToursService,
    private popoverCtrl: PopoverController,
    private storage: Storage,
    private router: Router,
    private alertCtrl: AlertController,
    private localNotifications: LocalNotifications) {
    this.btService.initalize();
    this.loadingSettings();
  }

  async loadingSettings() {
    this._storage = await this.storage.create();
    this._storage.get('setttings').then(settings => {
      this.settings.style = (settings === null) ? 'summer-style' : settings;
    });
  }

  updateSettings() {
    this._storage.set('settings', this.settings);
    this.setNotifications();
  }


  // A weekly notification is scheduled,
  // if notifications are activated.
  setNotifications() {
    if (this.settings.notifications === true) {
      this.localNotifications.schedule({
        id: 1,
        title: 'BoB Tours recommends:',
        text: 'Find a tour and enjoy life! Tap here...',
        data: { path: '/slideshow' },
        trigger: { every: ELocalNotificationTriggerUnit.WEEK }
      });
      this.onNotificationClick();
      // cancels/deactivates notifications.
    } else {
      this.localNotifications.cancelAll();
    }
  }

  // User clicked on the notification. The app shows
  // a message. After user clicked the button, the app shows
  // the slideshow.
  onNotificationClick() {
    this.localNotifications.on('click')
      .subscribe(notification => {
        const path = notification.data
          ? notification.data.path
          : '/';
        this.alertCtrl.create({
          header: notification.title,
          message: 'Be inspired by the following slideshow and book a tour!',
          buttons: [{
            text: 'Good idea!',
            handler: () => this.router.navigateByUrl(path)
          }]
        }).then(alert => alert.present());
      });
  }

  async about() {
    const popover = await this.popoverCtrl.create({
      component: AboutComponent,
      translucent: true
    });
    await popover.present();
  }

  filterByPrice() {
    this.hits = this.btService.filterTours(this.price);
  }

}

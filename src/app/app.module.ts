import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './components/about/about.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { RequestPage } from './pages/request/request.page';
import { MapPage } from './pages/map/map.page';
import { RequestPageModule } from './pages/request/request.module';
import { MapPageModule } from './pages/map/map.module';

@NgModule({
  declarations: [AppComponent, AboutComponent],
  entryComponents: [AppComponent, AboutComponent, RequestPage, MapPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RequestPageModule,
    MapPageModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, Geolocation, SocialSharing, LocalNotifications],
  bootstrap: [AppComponent],
})
export class AppModule {}

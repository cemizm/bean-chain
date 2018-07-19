import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IBeacon, BeaconRegion } from '../../../node_modules/@ionic-native/ibeacon';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  private region:BeaconRegion = null;


  constructor(public navCtrl: NavController, public navParams: NavParams, private ibeacon:IBeacon, private storage:StorageProvider) {
  }

  async initialize(){
    if(this.region != null)
      return;

    let id = await this.storage.getId();
    this.region = this.ibeacon.BeaconRegion(id, id, 0, 0);
  }

  async ionViewWillEnter() {
    await this.initialize();
    await this.ibeacon.startAdvertising(this.region);
  }

  async ionViewWillLeave() {
    if(this.region == null)
      return;
    
    await this.ibeacon.stopAdvertising(this.region);
  }
}

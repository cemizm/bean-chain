import { Component } from '@angular/core';
import { ActionSheetController, LoadingController } from 'ionic-angular';
import { FakePaymentProvider } from '../../providers/fake-payment/fake-payment';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html',
})
export class RechargePage {

  constructor(private actionSheetCtrl: ActionSheetController, 
              private storage: StorageProvider,
              private fakePayment:FakePaymentProvider, 
              private loading:LoadingController) {
  }

  fakeProvider() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Make a fake payment',
      buttons: [
        {
          text: '5 EUR',
          handler: () => { this.recharge(5) }
        },{
          text: '10 EUR',
          handler: () => { this.recharge(10) }
        },{
          text: '20 EUR',
          handler: () => { this.recharge(20) }
        },{
          text: '50 EUR',
          handler: () => { this.recharge(50) }
        },{
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  async recharge(amount) {
    let lc = this.loading.create({content:"Processing payment..."});
    lc.present();

    let id = await this.storage.getId();

    this.fakePayment.recharge(id, amount).subscribe((res)=>{}, (err)=>{}, () => {lc.dismiss()});
  }

}

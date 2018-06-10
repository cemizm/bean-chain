import { Injectable, NgZone } from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public address:string;
  public products:Array<any>;
  public qrcode:string = "asd";

  constructor(private esvc:ElectronService, private ngZone:NgZone) {
    if(this.esvc.isElectronApp) {
      this.esvc.ipcRenderer.on('address', (events, arg) => {
        this.ngZone.run(() => {
          this.address = arg;
          this.qrcode = JSON.stringify({address: this.address});
          console.log("new address:" + this.qrcode);
        });
      });

      this.esvc.ipcRenderer.send('getAddress');
    } else {
      this.address = "PYC9WIGXZTUHKCKHNDEHBWFEQ9AMUJR9RNGWHJUIGPIJWJITS9OSJTRGCUKNA9MMAQHVBLAMTSFWT9JCDD9REGNWXX";
      this.qrcode = JSON.stringify({address: this.address});
    }
  }
}

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { BeanchainProvider } from '../providers/beanchain/beanchain';
import { StorageProvider } from '../providers/storage/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private storage:StorageProvider, 
              private beanchain:BeanchainProvider) {

    this.initialize();
  }
  
  async initialize(){
    await this.platform.ready();
    let id = await this.storage.getId();
    
      this.beanchain.getAccount(id).subscribe((account)=>{ 
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.rootPage = TabsPage;
      }, (err) => {
        this.beanchain.postAccount(id).subscribe((result)=>{ 
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.rootPage = TabsPage;
        });
      });

  }
}

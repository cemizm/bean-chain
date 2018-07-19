import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AccountPage } from '../pages/account/account';
import { PaymentPage } from '../pages/payment/payment';
import { RechargePage } from '../pages/recharge/recharge';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BeanchainProvider } from '../providers/beanchain/beanchain';
import { StorageProvider } from '../providers/storage/storage';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { NativeStorage } from '../../node_modules/@ionic-native/native-storage';
import { IBeacon } from '@ionic-native/ibeacon';
import { FakePaymentProvider } from '../providers/fake-payment/fake-payment';

@NgModule({
  declarations: [
    MyApp,
    AccountPage,
    PaymentPage,
    RechargePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    PaymentPage,
    RechargePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BeanchainProvider,
    StorageProvider,
    NativeStorage,
    IBeacon,
    FakePaymentProvider
  ]
})
export class AppModule {}

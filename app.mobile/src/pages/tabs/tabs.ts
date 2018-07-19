import { Component } from '@angular/core';

import { AccountPage } from '../account/account';
import { PaymentPage } from '../payment/payment';
import { RechargePage } from '../recharge/recharge';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AccountPage;
  tab2Root = PaymentPage;
  tab3Root = RechargePage;

  constructor() {

  }
}

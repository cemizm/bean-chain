import { Component } from '@angular/core';
import { BeanchainProvider, Account, Transaction } from '../../providers/beanchain/beanchain';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  public textLabel:string = "0,00";
  private account:Account;
  public transactions:Transaction[];

  constructor(private storage:StorageProvider,
              private beanchain:BeanchainProvider) {
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData(refresher=null) {
    let id = await this.storage.getId();

    this.beanchain.getAccount(id).subscribe((account:Account)=>{
      this.account = account;
      this.textLabel = this.account.credit.toFixed(2).replace(/\./, ',');
      this.beanchain.getTransactions(id).subscribe((transactions)=>{
        transactions.sort((a, b)=>{
          return b.date - a.date;
        });
        this.transactions = transactions;
        if(refresher)
          refresher.complete();
      })
    }, (error) => { 
      if(refresher)
        refresher.complete();
    })
  }
}

import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import * as uuid from 'uuid/v4';

@Injectable()
export class StorageProvider {
  private static AccountKey:string = "accountid";
  private id:string = null;

  constructor(private nativeStorage: NativeStorage) { 

  }

  public async getId():Promise<string> {
    if(this.id != null)
      return this.id;
    
    try {
      this.id = await this.nativeStorage.getItem(StorageProvider.AccountKey);
    } catch(err){ await this.setId(); }

    return this.id;
  }

  private async setId():Promise<null> {
    this.id = uuid();
    
    try {
      await this.nativeStorage.setItem(StorageProvider.AccountKey, this.id);
    } catch(err){ console.log(err); }

    return null;
  }

}

import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Manager {
  name: 'string';
  machines: Machine[];
}

export interface Machine {
  id: string;
  location: string;
  name: string;
}

export interface Transaction {
  date: number;
  amount: number;
  machine: string;
  account: string;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class BeanchainService {

  private static Host = 'http://health-ledger.westeurope.cloudapp.azure.com:8000';
  private static Certificate = {
    username: 'manager',
    mspid: 'MainOrgMSP',
    key: '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQguKyW56YWhIJsBcYj\n' +
         '9GOlscFzlccD+boKK82/G4bh6AOhRANCAATXGE+9US4fWmImgs6rq8w9fEMm/SCe\n' +
         'asNacg0wbgPt/vU+mrXU+sHLJLte+qomZBujySUOgIjyZ2Z77xi3VywY\n-----END PRIVATE KEY-----',
    cert: '-----BEGIN CERTIFICATE-----\nMIICJjCCAcygAwIBAgIQBbCcm4IGOmqByrDsZ0V/eDAKBggqhkjOPQQDAjB4MQsw\n' +
          'CQYDVQQGEwJERTEMMAoGA1UECBMDTlJXMRIwEAYDVQQHEwlCaWVsZWZlbGQxITAf\n' +
          'BgNVBAoTGG1haW5vcmcuaGVhbHRoLWxlZGdlci5kZTEkMCIGA1UEAxMbY2EubWFp\n' +
          'bm9yZy5oZWFsdGgtbGVkZ2VyLmRlMCAXDTE4MDcxNjE4Mjc1OFoYDzIxMTgwNjIy\n' +
          'MTgyNzU4WjBhMREwDwYDVQQDDAhNYW4gQWdlcjELMAkGA1UEBhMCREUxDDAKBgNV\n' +
          'BAgMA05SVzEfMB0GA1UECgwWbWFpbm9yZy5iZWFuLWNoYWluLm9yZzEQMA4GA1UE\n' +
          'CwwHTWFuYWdlcjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNcYT71RLh9aYiaC\n' +
          'zqurzD18Qyb9IJ5qw1pyDTBuA+3+9T6atdT6wcsku176qiZkG6PJJQ6AiPJnZnvv\n' +
          'GLdXLBijTTBLMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQk\n' +
          'MCKAIGbYBFc6gxOePq6MOtDSl6Fa3mSAGERVNZJWw0iWbgAqMAoGCCqGSM49BAMC\n' +
          'A0gAMEUCIFzJcJbwE3MhIz2vGAxogxRkZyGmTu6YIwhtgnRACaOpAiEA3p8dyxEQ\n' +
          'bSm9CrLPcmLrUc7AkEjeM0X0YWwGfkMpV4M=\n-----END CERTIFICATE-----'
  };

  private httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'identity': btoa(JSON.stringify(BeanchainService.Certificate))
      })
    };
  }

  public get(): Observable<Manager> {
    return this.http.get<Manager>(`${BeanchainService.Host}/manager`, this.httpOptions);
  }

  public getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${BeanchainService.Host}/manager/transactions`, this.httpOptions);
  }

  public post(): Observable<Object> {
    return this.http.post(`${BeanchainService.Host}/manager`, null, this.httpOptions);
  }

  public put(manager: Manager): Observable<Object> {
    return this.http.post(`${BeanchainService.Host}/manager`, null, this.httpOptions);
  }
}

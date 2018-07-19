import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';

export interface Account {
  credit: number;
}

export interface Transaction {
  date: number,
  amount: number,
  source: string,
  account: string,
  note: string
}

@Injectable()
export class BeanchainProvider {

  private static Host = "http://health-ledger.westeurope.cloudapp.azure.com:8000";
  private static Certificate = {
    username:"mobile",
    mspid:"MainOrgMSP",
    key:"-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgI4nYoBB5oPYIMCap\nN3ytqe2OObNn/h8z3I3dgYmR79WhRANCAAR0yerlUnz6ORVctlYc8pFZ0WDSLK0I\nUP3+3wcjVLhRuQz32RohRrHCJ6dLsbfWgccKBroer9dD7TUwUgkMSicI\n-----END PRIVATE KEY-----",
    cert:"-----BEGIN CERTIFICATE-----\nMIICMDCCAdagAwIBAgIRAJutK2zeasCKFytxNUi7NF0wCgYIKoZIzj0EAwIweDEL\nMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmllbGVmZWxkMSEw\nHwYDVQQKExhtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUxJDAiBgNVBAMTG2NhLm1h\naW5vcmcuaGVhbHRoLWxlZGdlci5kZTAgFw0xODA3MTgxNDM1MzZaGA8yMTE4MDYy\nNDE0MzUzNlowajEbMBkGA1UEAwwSTW9iaWxlIEFwcGxpY2F0aW9uMQswCQYDVQQG\nEwJERTEMMAoGA1UECAwDTlJXMR8wHQYDVQQKDBZtYWlub3JnLmJlYW4tY2hhaW4u\nb3JnMQ8wDQYDVQQLDAZNb2JpbGUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAR0\nyerlUnz6ORVctlYc8pFZ0WDSLK0IUP3+3wcjVLhRuQz32RohRrHCJ6dLsbfWgccK\nBroer9dD7TUwUgkMSicIo00wSzAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIw\nADArBgNVHSMEJDAigCBm2ARXOoMTnj6ujDrQ0pehWt5kgBhEVTWSVsNIlm4AKjAK\nBggqhkjOPQQDAgNIADBFAiEA5F6fWupPa0XAkseBacAsJtVwclBct7H2EYRrF61i\njcoCIAIIZnfiBL3B509B9lbgr3oGAr1FeWltWUE3HqcG8P8w\n-----END CERTIFICATE-----"
  }
  private httpOptions = {
    headers: new HttpHeaders()
  }
  
  constructor(private http: HttpClient) {  
    this.httpOptions = {
      headers: new HttpHeaders({
        'identity': btoa(JSON.stringify(BeanchainProvider.Certificate))
      })
    };
  }

  public getAccount(id):Observable<Account> {
    return this.http.get<Account>(`${BeanchainProvider.Host}/account/${id}`, this.httpOptions);
  }

  public getTransactions(id):Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${BeanchainProvider.Host}/account/${id}/transactions`, this.httpOptions);
  }

  public postAccount(id):Observable<Object> {
    return this.http.post(`${BeanchainProvider.Host}/account/${id}`, null, this.httpOptions);
  }
}

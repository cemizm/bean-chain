import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';

@Injectable()
export class FakePaymentProvider {

  private static Host = "http://health-ledger.westeurope.cloudapp.azure.com:8000";
  private static Certificate = {
    username:"payment",
    mspid:"MainOrgMSP",
    key:"-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgXAQ/LFV74fGOAj0E\nv3Fk4QP6zQzZpTYlaYycwR+Pi86hRANCAAQeQ7fKoucCxNubpPfnqPP7JMtT4Be5\nSuFQRGP8+nJ9r2bPb0ld7Yuy8IyUU+bW2aDfSNjsdArb45AGB9KkT937\n-----END PRIVATE KEY-----",
    cert:"-----BEGIN CERTIFICATE-----\nMIICMzCCAdmgAwIBAgIQWXOQNpkPRibwN/4U+/qDPzAKBggqhkjOPQQDAjB4MQsw\nCQYDVQQGEwJERTEMMAoGA1UECBMDTlJXMRIwEAYDVQQHEwlCaWVsZWZlbGQxITAf\nBgNVBAoTGG1haW5vcmcuaGVhbHRoLWxlZGdlci5kZTEkMCIGA1UEAxMbY2EubWFp\nbm9yZy5oZWFsdGgtbGVkZ2VyLmRlMCAXDTE4MDcxODE0MzQ1NVoYDzIxMTgwNjI0\nMTQzNDU1WjBuMR4wHAYDVQQDDBVGYWtlIFBheW1lbnQgUHJvdmlkZXIxCzAJBgNV\nBAYTAkRFMQwwCgYDVQQIDANOUlcxHzAdBgNVBAoMFm1haW5vcmcuYmVhbi1jaGFp\nbi5vcmcxEDAOBgNVBAsMB1BheW1lbnQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNC\nAAQeQ7fKoucCxNubpPfnqPP7JMtT4Be5SuFQRGP8+nJ9r2bPb0ld7Yuy8IyUU+bW\n2aDfSNjsdArb45AGB9KkT937o00wSzAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/\nBAIwADArBgNVHSMEJDAigCBm2ARXOoMTnj6ujDrQ0pehWt5kgBhEVTWSVsNIlm4A\nKjAKBggqhkjOPQQDAgNIADBFAiAJ03lFsxT+ha3pfG0KzmCwVk5bU9qkFW96VG9v\nataS4wIhAJt7JjShiV8+UU9fT1zuaqvUvRZDrVvudFTG0oZDYkp/\n-----END CERTIFICATE-----"
  }
  private httpOptions = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {  
    this.httpOptions = {
      headers: new HttpHeaders({
        'identity': btoa(JSON.stringify(FakePaymentProvider.Certificate))
      })
    };
  }

  public recharge(account, amount):Observable<object> {
    return this.http.post(`${FakePaymentProvider.Host}/transaction/recharge`, {account: account, amount: amount, note: ""}, this.httpOptions);
  }
}

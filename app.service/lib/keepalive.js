const Client = require('./beanchain.client');

module.exports = async function(config) {
    const identity = {
        "username":"Hans Pollmeier",
        "mspid":"MainOrgMSP",
        "key":"-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgq92fWEiyj5A33dKL\nubf8RYVTb1PZgF4zDCOZWNdOwCOhRANCAASqA54A34J+Ie5QN2K/0s5GDiujPIzK\nG4H2S+GcGEfueyL/AC8U7vpipKDJSachVlewMRt5u1maQjbXJt0d6ut2\n-----END PRIVATE KEY-----",
        "cert":"-----BEGIN CERTIFICATE-----\nMIICLzCCAdWgAwIBAgIRANsW3lTtBjowu1HTWv1ks08wCgYIKoZIzj0EAwIweDEL\nMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmllbGVmZWxkMSEw\nHwYDVQQKExhtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUxJDAiBgNVBAMTG2NhLm1h\naW5vcmcuaGVhbHRoLWxlZGdlci5kZTAgFw0xODA2MTkxMTIyMzBaGA8yMTE4MDUy\nNjExMjIzMFowaTEXMBUGA1UEAwwOSGFucyBQb2xsbWVpZXIxCzAJBgNVBAYTAkRF\nMQwwCgYDVQQIDANOUlcxITAfBgNVBAoMGG1haW5vcmcuaGVhbHRoLWxlZGdlci5k\nZTEQMA4GA1UECwwHUGF0aWVudDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABKoD\nngDfgn4h7lA3Yr/SzkYOK6M8jMobgfZL4ZwYR+57Iv8ALxTu+mKkoMlJpyFWV7Ax\nG3m7WZpCNtcm3R3q63ajTTBLMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAA\nMCsGA1UdIwQkMCKAIGbYBFc6gxOePq6MOtDSl6Fa3mSAGERVNZJWw0iWbgAqMAoG\nCCqGSM49BAMCA0gAMEUCIEpmlV1zPjMNMb0FBrBe3sPzeJZYO8yw75QJpLJHRRHI\nAiEA5fMLTnrX1gSuQrYSwtFueI6CzBxtpQz+RmIjosus9N0=\n-----END CERTIFICATE-----"
    }

    let client = await Client.initWithIdentity(config, identity);

    setInterval(async () => {
        await client.account_get("asd");
    }, 25000);
  }
  
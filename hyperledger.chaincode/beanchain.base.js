module.exports = class {
    constructor(identity, state) {
      this.identity = identity;
      this.state = state;
    }
  
    get Cert() {
      return this.identity.cert;
    }
  
    get UserId() {
      return this.Cert.serial;
    }
  
    get Subject() {
      return this.Cert.subject;
    }
  
    get UserType() {
      return this.Subject.organizationalUnitName;
    }
  
    get CommonName() {
      return this.Subject.commonName;
    }
}
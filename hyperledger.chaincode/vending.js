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

  /*
   * Gets an account by the NFC Serialnumber
   */
  async _getAccountBySerial(serial, throwError = false) {
    let result = await this.state.get(serial);

    if(throwError && result == null)
      throw new Error("getUserBySerial: Unknown serial '" + serial + "'");

    return result;
  }

  /*
   * Gets an account by the card number printed on the NCF card
   */
  async _getAccountByCardnumber(cardnumber, throwError = true) {
    let results = await this.state.query({ selector: { cardnumber:parseInt(cardnumber) } });

    if(throwError && (results == null || results.length == 0))
      throw new Error("getUserByCardnumber: Unknown cardnumber '" + cardnumber + "'");

    return results != null && results.length > 0 ? results[0] : null;
  }

  _getAccountDetails(serial, account) {
    return {
      serial: serial,
      name: account.name,
      cardnumber: account.cardnumber,
      disabled: account.disabled,
      credit: account.credit
    };
  }

  _addTransaction(account, amount, note) {
    account.credit += amount;
    if(account.credit < 0)
      throw new Error("Insufficient credits for transaction");

    let type = amount < 0 ? "Abbuchung" : "Aufladung"

    let title = `${type} durch ${this.CommonName}: ${note}`

    account.transactions.push({
      date: new Date(),
      note: title,
      amount: amount,
    });
  }

  async getAccountByCardnumber(cardnumber) {
    let result = await this._getAccountByCardnumber(cardnumber, true);

    return this._getAccountDetails(result.key, result.value);
  }

  async getAccountBySerial(serial) {
    let result = await this._getAccountBySerial(serial, true);

    return this._getAccountDetails(serial, result);
  }

  /*
   * Gets the list of accounts
   */
  async getAccounts() {
    if(this.UserType !== "Manager")
      throw new Error("Only maangers can read the list of accounts");

    let results = await this.state.getStateByRange("", "");
    if(!results)
      results = [];

    let accounts = [];
    for(let result of results) {
      accounts.push(this._getAccountDetails(result.key, result.value));
    }

    return accounts;
  }

  /*
   * Creates a new account with the given account informations. 
   */
  async createAccount(info) {
    if(this.UserType !== "Manager")
      throw new Error("Only maangers can create accounts");

    let account = await this._getAccountBySerial(info.serial);
    if(account != null)
      throw new Error(`Account with serial ${info.serial} already exists`);
    
    account = await this._getAccountByCardnumber(info.cardnumber, false);
    if(account != null)
      throw new Error(`Account with cardnumber ${info.cardnumber} already exists`);

    account = {
      name: info.name,
      cardnumber: info.cardnumber,
      disabled: info.disabled,
      credit: 0,
      transactions: []
    };

    await this.state.put(info.serial, account);

    return this._getAccountDetails(info.serial, account);
  }

  /*
   * Updates an account with the given account details.
   */
  async updateAccount(info) {
    if(this.UserType !== "Manager")
      throw new Error("Only maangers can update accounts");

    let account = await this._getAccountBySerial(info.serial);
    if(account == null)
      throw new Error(`Account ${info.serial} does not exists`);

    let account2 = await this._getAccountByCardnumber(info.cardnumber, false);
    if(account2 && account2.key != info.serial)
      throw new Error(`Account with cardnumber ${info.cardnumber} already exists`);

    account.name = info.name;
    account.cardnumber = info.cardnumber;
    account.disabled = info.disabled;

    await this.state.put(info.serial, account);

    return this._getAccountDetails(info.serial, account);
  }

  /*
   * Gets the list of transactions assoicated with an account.
   */
  async getTransactions(serial) {
    let account = await this._getAccountBySerial(serial);
    if(account == null)
      throw new Error("Account does not exists");

    return account.transactions;
  }

  /*
   * Add a transactions to an account.
   */
  async addTransaction(info) {
    if(this.UserType !== "Manager" && this.UserType !== "Machine")
      throw new Error("Only managers or machines can add transactions");

    if(info.amount > 0 && this.UserType !== "Manager")
    throw new Error("Only managers can add positive transactions");

    let account = await this._getAccountBySerial(info.serial);
    if(account == null)
      throw new Error(`Account ${info.serial} does not exists`);

    this._addTransaction(account, info.amount, info.note)

    await this.state.put(info.serial, account);
  }
}

var router = require('express').Router();

router.get('/cardnumber/:cardnumber', async (req, res) => {
  try {
    if(!req.params.cardnumber)
      throw new Error("Invalid cardnumber");

    let account = await req.client.getAccountByCardnumber(req.params.cardnumber);
    if(account == null)
      throw new Error("No account");

    res.send(account);
  } catch(err){
    res.status(500).send(err);
  }
});

router.get('/serial/:serial', async (req, res) => {
  try {
    if(!req.params.serial)
      throw new Error("Invalid serial");

    let account = await req.client.getAccountBySerial(req.params.serial);
    if(account == null)
      throw new Error("No account");

    res.send(account);
  } catch(err){
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    let accounts = await req.client.getAccounts();
    res.send(accounts);
  } catch(err){
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    await req.client.addAccount(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

router.put('/', async (req, res) => {
  try {
    await req.client.updateAccount(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;

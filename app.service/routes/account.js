var router = require('express').Router();

router.get('/:id', async (req, res) => {
  try {
    if(!req.params.id)
      throw new Error("Invalid account id");

    let account = await req.client.account_get(req.params.id);
    if(account == null)
      throw new Error("No account");

    res.send(account);
  } catch(err){
    res.status(500).send(err);
  }
});

router.get('/:id/transactions', async (req, res) => {
  try {
    if(!req.params.id)
      throw new Error("Invalid account id");

    let account = await req.client.account_getTransactions(req.params.id);
    if(account == null)
      throw new Error("No account");

    res.send(account);
  } catch(err){
    res.status(500).send(err);
  }
});

router.post('/:id', async (req, res) => {
  try {
    if(!req.params.id)
      throw new Error("Invalid account id");

    await req.client.account_post(req.params.id);
    
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;

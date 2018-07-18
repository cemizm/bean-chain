var router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    let manager = await req.client.manager_get();
    res.send(manager);
  } catch(err){
    res.status(500).send(err);
  }
});

router.get('/transactions', async (req, res) => {
  try {
    let transactions = await req.client.manager_getTransactions();
    res.send(transactions);
  } catch(err){
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    await req.client.manager_post();
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

router.put('/', async (req, res) => {
  try {
    await req.client.manager_put(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;

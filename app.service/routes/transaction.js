var router = require('express').Router();

router.get('/:serial', async (req, res) => {
  try {
    if(!req.params.serial)
      throw new Error("Invalid serial");

    let transactions = await req.client.getTransaction(req.params.serial);
    res.send(transactions);
  } catch(err){
    res.status(500).send(err);
  }
});


router.post('/', async (req, res) => {
  try {
    await req.client.addTransaction(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;

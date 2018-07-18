var router = require('express').Router();

router.post('/redeem', async (req, res) => {
  try {
    await req.client.transaction_redeem(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

router.post('/recharge', async (req, res) => {
  try {
    await req.client.transaction_recharge(req.body);
    res.send();
  } catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;

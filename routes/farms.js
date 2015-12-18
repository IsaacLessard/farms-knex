var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Farms() {
  return knex('farms')
}

router.get('/', function(req, res, next) {
  Farms().select().then(function (farms) {
    res.json(farms);
  }).catch(function (err) {
    res.json(err);
  });
});

router.post('/', function (req, res, next) {
  knex.transaction(function (trx) {
    return Farms().insert({
      name: req.body.name,
    }, 'id')
    .transacting(trx)
    .then(function (farm) {
      return farmsAlpacas().insert({
        farm_id: farm[0],
        alpaca_id: req.body.alpaca_id
      }, 'id')
      .transacting(trx)
    })
    .then(trx.commit)
    .catch(trx.rollback)
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json(err);
  });
})


module.exports = router;

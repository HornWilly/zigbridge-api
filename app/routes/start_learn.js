var express = require('express');
var router = express.Router();
var client = require('../zigbridge_client');

/* POST /start-learn */
router.post('/', function(req, res, next) {
  client.send('{"command":"open_network"}');
  res.send('start learning device');
});

module.exports = router;

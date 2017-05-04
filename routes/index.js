const express = require('express');
const router = express.Router();

router.get('/weather/:zipcodes', require('./weather'));

router.use(require('./404'));
router.use(require('./error'));

module.exports = router;

const debug = require('debug')('vuether-api:routes:error');

module.exports = (err, req, res, next) => {
  debug(err);
  res.status(err.status || 500);
  res.send('');
};

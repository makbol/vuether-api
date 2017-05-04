const debug     = require('debug')('vuether-api:routes:weather');
const NodeCache = require('node-cache');
const weather   = require('../src/weather');
const util      = require('../util');

const cache = new NodeCache({
  stdTTL: 60 * 5 // 5 minutes
});

module.exports = (req, res) => {

  const isValid = /^(\d+)(,*\d+)*$/;
  let zipcodes = req.params.zipcodes;

  if(util.onProd()) {
    res.header('Access-Control-Allow-Origin', 'https://makbol.github.io');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }

  if(!isValid.test(zipcodes)) {
    debug('Invalid zipcode');
    return res.sendStatus(500);
  }

  zipcodes = zipcodes.split(',');
  const promises = zipcodes.map(fetchWeather);

  return Promise.all(promises)
    .then(result => {
      if(result.length === 1) {
        return res.json(result[0]);
      }
      res.json(result);
    })
    .catch(err => {
      debug(err);
      res.sendStatus(500);
    });
};

function fetchWeather(zipcode) {

  const cached = cache.get(zipcode);
  if(cached) {
    return Promise.resolve(cached);
  }

  return weather.getWeatherByZipcode(zipcode)
    .then(weather => {
      weather = Object.assign({}, {zipcode}, weather);
      cache.set(zipcode, weather);
      return weather;
    });
}

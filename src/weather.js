const ForecastIO = require('forecast-io');
const GoogleMapsClient = require('@google/maps');

const forecast = new ForecastIO(process.env.FORECAST_TOKEN);
const googleMapsClient = GoogleMapsClient.createClient({
  key: process.env.GMAP_KEY
});

module.exports = {
  getWeatherByZipcode
};

function getCoordinatesByZipcode(zipcode) {
  return new Promise((resolve, reject) => {
    googleMapsClient.geocode({ address: zipcode }, function(err, response) {
      if (err) return reject(err);
      resolve(response.json.results[0].geometry.location);
    });
  });
}

function getWeatherByCoords(coords) {
  return forecast
    .latitude(coords.lat)
    .longitude(coords.lng)
    .units('ca')
    .language('en')
    .exclude('minutely,flags')
    .get()
    .then(res => {
      return JSON.parse(res);
    });
}

function getWeatherByZipcode(zipcode) {
  return getCoordinatesByZipcode(zipcode).then(getWeatherByCoords);
}



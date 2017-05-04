const DarkSky = require('dark-sky');
const GoogleMapsClient = require('@google/maps');

const forecast = new DarkSky(process.env.FORECAST_TOKEN);
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
    .get();
}

function getWeatherByZipcode(zipcode) {
  return getCoordinatesByZipcode(zipcode).then(getWeatherByCoords);
}



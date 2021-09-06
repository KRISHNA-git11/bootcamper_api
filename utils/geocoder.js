const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
const options = {
  provider: 'mapquest',
  httpAdapteer: 'https',
  apiKey: '1FJpvmpnT9pus6dPLod6NmMhNeYasDdS',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

// 1FJpvmpnT9pus6dPLod6NmMhNeYasDdS

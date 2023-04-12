const axios = require("axios");

const geocode = async (address) => {
  const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_API_KEY}`);
  if ( result.data.status == "ZERO_RESULTS"){
    return "Error"
  }
  const place_id = result.data.results[0].place_id;

  const resultPlace = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.MAPS_API_KEY}`);
  const maps = resultPlace.data.result.url;

  return {
    "Place": place_id,
    "Map": maps,
  };
};

module.exports = { geocode };
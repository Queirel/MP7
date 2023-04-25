const { geocode } = require("../../helpers/geocode");

// Get Geocode
const getGeocode = async (req, res) => {
  try {
    const { street_number, route, locality } = req.body;
    const address = `${street_number},${route},${locality}`;
    module.exports = address;

    const result = await geocode(address);
    res.json(result);

  } catch (error) {
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

module.exports = {
  getGeocode,
};

const { user, product } = require("../../models");
const { passwordHash, passwordCompare } = require("../../helpers/bcrypt");
const { geocode } = require("../../helpers/geocode");

const checkUserId = async () => {
    if (/[^0-9]/.test(id)) {
        return res.status(400).json({ Error: "User id must be an integer" });
      }
    const getUser = await user.findOne({ where: { id } });
      if (!getUser) {
        return res.status(400).json({ Error: "User does not exists" });
      }
}

// Update own User
const checkGetUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
        // User id conditions
      if (/[^0-9]/.test(id)) {
        return res.status(400).json({ Error: "User id must be an integer" });
      }
      const getUser = await user.findOne({ where: { id } });
      if (!getUser) {
        return res.status(400).json({ Error: "User does not exists" });
      }
      next()
    } catch (error) {
      res
        .status(500)
        .json({ Error: "An unexpected error occurred. please try again later" });
      console.log(error.message);
    }
  };
  

  
// Update own User
const checkUpdateOwnUser = async (req, res) => {
    try {
      const id = req.user.id;
      const getUser = await user.findOne({ where: { id } });
      const {
        user_name,
        user_realname,
        user_lastname,
        user_dni,
        user_email,
        user_street_number,
        user_route,
        user_locality,
      } = req.body;
  
      if (!user_name) {
        getUser_name = getUser.dataValues.user_name;
      } else {
        if (/[^a-zA-Z0-9]/.test(user_name)) {
          return res
            .status(400)
            .json({ Error: "The username must be only letters and numbers" });
        }
        if (user_name.length >= 15) {
          return res
            .status(400)
            .json({ Error: "The username must be less than 15 characters" });
        }
        if (user_name.length < 3) {
          return res
            .status(400)
            .json({ Error: "The username must be at least 3 characters" });
        }
        getUser_name = user_name;
      }
      if (!user_realname) {
        getUser_realname = getUser.dataValues.user_realname;
      } else {
        if (/[^a-zA-Z]/.test(user_realname)) {
          return res.status(400).json({ Error: "The name must be only letters" });
        }
        if (user_realname.length >= 15) {
          return res
            .status(400)
            .json({ Error: "The name must be less than 15 characters" });
        }
        if (user_realname.length < 3) {
          return res
            .status(400)
            .json({ Error: "The name must be at least 3 letters" });
        }
        getUser_realname = user_realname;
      }
      if (!user_lastname) {
        getUser_lastname = getUser.dataValues.user_lastname;
      } else {
        if (/[^a-zA-Z]/.test(user_lastname)) {
          return res
            .status(400)
            .json({ Error: "The lastname must be only letters" });
        }
        if (user_lastname.length >= 15) {
          return res
            .status(400)
            .json({ Error: "The lastname must be less than 15 characters" });
        }
        if (user_lastname.length < 2) {
          return res
            .status(400)
            .json({ Error: "The lastname must be at least 2 letters" });
        }
        getUser_lastname = user_lastname;
      }
  
      if (!user_dni) {
        getUser_dni = getUser.dataValues.user_dni;
      } else {
        if (/[^0-9]/.test(user_dni)) {
          return res.status(400).json({ Error: "DNI must be an integer" });
        }
        const dniLenght = user_dni.toString().length;
        if (dniLenght < 8) {
          return res
            .status(400)
            .json({ Error: "DNI must be at least 8 numbers" });
        }
        if (dniLenght > 10) {
          return res
            .status(400)
            .json({ Error: "DNI must be at most 10 numbers" });
        }
        getUser_dni = user_dni;
      }
      if (!user_email) {
        getUser_email = getUser.dataValues.user_email;
      } else {
        getUser_email = user_email;
      }
      if (!user_street_number && !user_route && !user_locality) {
        getUser_address = getUser.dataValues.user_address;
        address = getUser.dataValues.user_address
  
      } else {
        // Address conditions
        if (user_street_number) {
          if (user_street_number.length > 30) {
            return res
              .status(400)
              .json({ Error: "The street number must be at most 10 characters" });
          }
        }
        if (user_route) {
          if (user_route.length > 30) {
            return res
              .status(400)
              .json({ Error: "Route must be at most 30 characters" });
          }
        }
        if (user_locality) {
          if (user_locality.length > 30) {
            return res
              .status(400)
              .json({ Error: "Locality must be at most 30 characters" });
          }
        }
        const user_address = `${user_street_number},${user_route},${user_locality}`;
        address = await geocode(user_address);
        if (address == "Error") {
          return res
            .status(400)
            .json({ Error: "Some address field is incorrect" });
        }
        getUser_address = address.Place;
      }
  
      await user.update(
        {
          user_name: getUser_name,
          user_realname: getUser_realname,
          user_lastname: getUser_lastname,
          user_dni: getUser_dni,
          user_email: getUser_email,
          user_address: getUser_address,
        },
        { where: { id } }
      );
      res.status(200).json({
        id,
        "User name": getUser_name,
        Name: getUser_realname,
        Lastname: getUser_lastname,
        DNI: getUser_dni,
        email: getUser_email,
        Address: address,
      });
    } catch (error) {
      res
        .status(500)
        .json({ Error: "An unexpected error occurred. please try again later" });
      console.log(error.message);
    }
  };
  
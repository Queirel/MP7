const { user, product } = require("../models");
const { passwordHash, passwordCompare } = require("../helpers/bcrypt");
const { geocode } = require("../helpers/geocode");
const logger = require("../helpers/logger");

// Get user by Id
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
      // User id conditions
    if (/[^0-9]/.test(id)) {
      logger.warn(`get/users/:id - ("User id must be an integer")`, { user: req.params.id, code: 400, method: "get", route: "/users/:id"})
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    const getUser = await user.findOne({ where: { id } });
    if (!getUser) {
      logger.warn(`get/users/:id - ("User does not exist")`, { user: req.params.id, code: 400, method: "get", route: "/users/:id"})
      return res.status(400).json({ Error: "User does not exist" });
    }
    logger.info(`get/users/:id - (getting user ${req.params.id})`, { user: req.params.id, code: 200, method: "get", route: "/users/:id"})
    res.status(200).json({ "User name": getUser.user_name });
  } catch (error) {
    logger.error(`get/users/:id - (getting user ${req.params.id}) - Error(500): ${error}`, { user: req.params.id, code: 500, method: "get", route: "/users/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};


// Update own User
const updateOwnUser = async (req, res) => {
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
        logger.warn(`put/users/:id - (The username must be only letters and numbers)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "The username must be only letters and numbers" });
      }
      if (user_name.length >= 15) {
        logger.warn(`put/users/:id - (The username must be less than 15 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "The username must be less than 15 characters" });
      }
      if (user_name.length < 3) {
        logger.warn(`put/users/:id - (The username must be at least 3 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
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
        logger.warn(`put/users/:id - (The name must be only letters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res.status(400).json({ Error: "The name must be only letters" });
      }
      if (user_realname.length >= 15) {
        logger.warn(`put/users/:id - (The name must be less than 15 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "The name must be less than 15 characters" });
      }
      if (user_realname.length < 3) {
        logger.warn(`put/users/:id - (The name must be at least 3 letters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
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
        logger.warn(`put/users/:id - (The lastname must be only letters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "The lastname must be only letters" });
      }
      if (user_lastname.length >= 15) {
        logger.warn(`put/users/:id - (The lastname must be less than 15 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "The lastname must be less than 15 characters" });
      }
      if (user_lastname.length < 2) {
        logger.warn(`put/users/:id - (The lastname must be at least 2 letters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
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
        logger.warn(`put/users/:id - (DNI must be an integer)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res.status(400).json({ Error: "DNI must be an integer" });
      }
      const dniLenght = user_dni.toString().length;
      if (dniLenght < 8) {
        logger.warn(`put/users/:id - (DNI must be at least 8 numbers)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
        return res
          .status(400)
          .json({ Error: "DNI must be at least 8 numbers" });
      }
      if (dniLenght > 10) {
        logger.warn(`put/users/:id - (DNI must be at most 10 numbers)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
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
          logger.warn(`put/users/:id - (The street number must be at most 10 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
          return res
            .status(400)
            .json({ Error: "The street number must be at most 10 characters" });
        }
      }
      if (user_route) {
        if (user_route.length > 30) {
          logger.warn(`put/users/:id - (Route must be at most 30 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
          return res
            .status(400)
            .json({ Error: "Route must be at most 30 characters" });
        }
      }
      if (user_locality) {
        if (user_locality.length > 30) {
          logger.warn(`put/users/:id - (Locality must be at most 30 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
          return res
            .status(400)
            .json({ Error: "Locality must be at most 30 characters" });
        }
      }
      const user_address = `${user_street_number},${user_route},${user_locality}`;
      address = await geocode(user_address);
      if (address == "Error") {
        logger.warn(`put/users/:id - (me address field is incorrect)`, { user: req.user.id, code: 400, method: "put", route: "/users/:id"})
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
    logger.info(`put/users/:id - (updated own user ${req.user.id})`, { user: req.user.id, code: 200, method: "put", route: "/users/:id"})
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
    logger.error(`put/users/:id - (updating own user ${req.user.id}) - Error(500): ${error}`, { user: req.user.id, code: 500, method: "put", route: "/users/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Delete own User
const deleteOwnUser = async (req, res) => {
  try {
    const id = req.user.id;
    if (req.user.user_role == "admin") {
      logger.warn(`delete/users/:id - (You can't delete an admin account)`, { user: req.user.id, code: 400, method: "delete", route: "/users/:id"})
      return res
        .status(400)
        .json({ Error: "You can't delete an admin account" });
    }
    const getProduct = await product.findOne({ where: { prod_user_id: id } });
    if (getProduct) {
      logger.warn(`delete/users/:id - (User owns products, cannot be removed)`, { user: req.user.id, code: 400, method: "delete", route: "/users/:id"})
      return res
        .status(400)
        .json({ Error: "User owns products, cannot be removed" });
    }
    logger.info(`delete/users/:id - (deleted own user ${req.user.id})`, { user: req.user.id, code: 200, method: "delete", route: "/users/:id"})
    await user.destroy({ where: { id } });
    res.status(200).json({ Message: "User deleted" });
  } catch (error) {
    logger.error(`delete/users/:id - (deleting own user ${req.user.id}) - Error(500): ${error}`, { user: req.user.id, code: 500, method: "delete", route: "/users/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Password change
const updateOwnUserPassword = async (req, res) => {
  try {
    const id = req.user.id;
    const getUser = await user.findOne({ where: { id } });
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      logger.warn(`put/users/pass/new - (You must fill the fields)`, { user: req.user.id, code: 400, method: "put", route: "/users/pass/new"})
      return res.status(400).json({ Error: "You must fill the fields" });
    }

    const passCompare = await passwordCompare(
      oldPassword,
      getUser.user_password
    );
    if (!passCompare) {
      logger.warn(`put/users/pass/new - (Incorrect password)`, { user: req.user.id, code: 400, method: "put", route: "/users/pass/new"})
      return res.status(400).json({ Error: "Incorrect password" });
    }
    if (oldPassword == newPassword) {
      logger.warn(`put/users/pass/new - (New password cannot be the same as the old one)`, { user: req.user.id, code: 400, method: "put", route: "/users/pass/new"})
      return res
        .status(400)
        .json({ Error: "New password cannot be the same as the old one" });
    }

    if (oldPassword.length > 30 || newPassword.length > 30) {
      logger.warn(`put/users/pass/new - (Password must be at most 30 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/pass/new"})
      return res
        .status(400)
        .json({ Error: "Password must be at most 30 characters" });
    }

    if (oldPassword.length < 4 || newPassword.length < 4) {
      logger.warn(`put/users/pass/new - (Password must be at least 4 characters)`, { user: req.user.id, code: 400, method: "put", route: "/users/pass/new"})
      return res
        .status(400)
        .json({ Error: "Password must be at least 4 characters" });
    }

    const passHash = await passwordHash(newPassword);

    await user.update(
      {
        user_password: passHash,
      },
      { where: { id } }
    );
    logger.info(`put/users/pass/new - (updating own user ${req.user.id})`, { user: req.user.id, code: 200, method: "put", route: "/users/pass/new"})
    res.status(200).json({ Message: "Password has been changed" });
  } catch (error) {
    logger.error(`put/users/pass/new - (updating own user ${req.user.id}) - Error(500): ${error}`, { user: req.user.id, code: 500, method: "put", route: "/users/pass/new"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

module.exports = {
  getUserById,
  updateOwnUser,
  deleteOwnUser,
  updateOwnUserPassword,
};

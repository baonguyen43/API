const jwtSetting = require("../../constants/jwtSetting");
const JWT = require("jsonwebtoken");
const {
  generateToken,
  passportVerifyAccount,
} = require("../../helper/jwtHelper");
const { Customer } = require("../../models");

module.exports = {
  login: async (req, res, next) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      } = req.user;
      const token = generateToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      });
      const refreshToken = passportVerifyAccount(_id);
      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  checkRefreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSetting.SECRET, async (err, data) => {
        if (err) {
          return res.status(401).json({
            message: "refreshToken is invalid",
          });
        } else {
          const { id } = data;
          const customer = await Customer.findOne({
            _id: id,
            isDeleted: false,
          })
            .select("-password")
            .lean();
          // if (customer) {
          // const token = generateToken(customer)
          if (customer) {
            const {
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            } = customer;
            const token = generateToken({
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            });
            return res.status(200).json({ token });
          }
          return res.sendStatus(401);
        }
      });
    } catch (error) {
      console.log("Nguyenne error Nguyenne", error);
      res.status(400).json({
        statusCode: 400,
        message: "Error",
      });
    }
  },

  basicLogin: async (req, res, next) => {
    try {
      const user = await Customer.findById(req.user._id)
        .select("-password")
        .lean();
      const token = generateToken(user);
      // const refreshToken = passportVerifyAccount(user._id);

      res.json({
        token,
        // refreshToken,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      res.sendStatus(400);
    }
  },

  getMe: async (req, res, next) => {
    try {
      res.status(200).json({
        message: "Get information success",
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },
};

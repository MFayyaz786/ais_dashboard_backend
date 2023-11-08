const Joi = require("joi");
const bcrypt = require("bcrypt");
const JWTService = require("../services/zargarUserJWTServices");
const RefreshToken = require("../model/zargarUserRefreshTokenModel");
const User = require("../model/zargarUserModel");
const UserDTO = require("../dto/zargarUserDto");
const zargarUserController = {
  async register(req, res, next) {
    //1. Validate all the inputs
    const userRegistrationSchema = Joi.object({
      name: Joi.string()
        .min(3)
        .max(15)
        .required(),
      phone: Joi.string()
        .min(11)
        .max(15)
        .required(),
      password: Joi.string().required(),
    });
    const { error } = userRegistrationSchema.validate(req.body);
    //2. If error is in the Validation -- throw that error to middleware
    if (error) {
      return next(error);
    }
    //3. If phone already already exists - > return an error message
    const { name, phone, password } = req.body;
    try {
      const phoneInUse = await User.exists({ phone });
      if (phoneInUse) {
        const error = {
          status: 409,
          message:
            "Phone Number Already exists, please try another phone number",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //4. hash password
    const passwordHash = await bcrypt.hash(password, 10);
    //5. store data in DB

    let AccessToken;
    let RefreshToken;
    let userToRegister;
    let user;
    try {
       userToRegister = new User({
        name: name,
        phone: phone,
        password: passwordHash,
      });
      user = await userToRegister.save();

      // generate new tokens
      AccessToken = JWTService.SignAccessToken({ _id: user._id }, "30m");
      RefreshToken = JWTService.SignRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    //store refresh token in db
    await JWTService.StoreRefreshToken(RefreshToken, user._id);

    res.cookie("accessToken", AccessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", RefreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //6. send the response
    const userDTO = new UserDTO(user);
    res.status(201).json({msg:"User Registered successfully", data: userToRegister ,accessToken:AccessToken,refreshToken:RefreshToken});
  },

  async login(req, res, next) {
    //1. Validate the inputs from user

    // const userLogin = Joi.object({
    //   phone: Joi.string()
    //     .min(11)
    //     .max(15)
    //     .required(),
    //   password: Joi.string().required(),
    // });

    // const { error } = userLogin.validate(req.body);

    // if (error) {
    //   return next(error);
    // }

    //2. Match the credentials

    const { phone, password } = req.body;
    console.log("body",req.body)

    let user;
    try {
      user = await User.findOne({ phone: phone });
      if (!user) {
        const error = {
          status: 409,
          message: "Invalid Phone Number",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 409,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //3. Update the token
    const accessToken = JWTService.SignAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.SignRefreshToken({ _id: user._id }, "30m");

    //store token in DB
    try {
      RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //4. send response
    const userDTO = new UserDTO(user);

    res.status(200).json({ msg: "SUCCESSFULLY LOGGED IN", data: userDTO,accessToken:accessToken,refreshToken:refreshToken });
  },
};
module.exports = zargarUserController;

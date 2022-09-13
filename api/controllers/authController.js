import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).json("User has been created.");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user)
      return next(createError(404, "User not found."));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(
        createError(400, "Wrong password or username!")
      );

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    const {
      username,
      password,
      isAdmin,
      address,
      cid,
      country,
      gender,
      phone,
      ...otherDetails
    } = user._doc;
    res
      .cookie("access_token", token, {
        maxAge: 90000000,
        httpOnly: true,
      })
      .status(200)
      .json({
        details: { ...otherDetails },
        isAdmin,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res
    .cookie("access_token", "", {
      httpOnly: true,
    })
    .status(200)
    .json("Logged out successfully.");
};

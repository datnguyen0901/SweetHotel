import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Role from "../models/Role.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    //find user by email
    const user = await User.findOne({
      email: req.body.email,
    });

    const url = `http://localhost:8800/api/users/confirm/${user._id}`;

    transporter.sendMail({
      to: req.body.email,
      subject: "Verify Account",
      html: `Click <a href = '${url}'>here</a> to confirm your email.`,
    });
    return res.status(201).send({
      message: `Sent a verification email to ${req.body.email}`,
    });
  } catch (error) {
    return res.status(500).send(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    const role = await Role.findById(user.roleId);

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

    if (user.status !== "active") {
      return next(
        createError(
          400,
          "Your account is not activated yet. Please check your mail or contact us."
        )
      );
    }

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
      city,
      createdAt,
      email,
      country,
      gender,
      phone,
      ...otherDetails
    } = user._doc;

    const oneDay = 24 * 60 * 60 * 1000;

    res
      .cookie("access_token", token, {
        maxAge: 30 * oneDay,
        httpOnly: true,
      })
      .status(200)
      .json({
        details: {
          ...otherDetails,
          isAdmin: isAdmin,
          hotelId: role.hotelId,
        },
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

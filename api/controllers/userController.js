import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const activeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.status === "active") {
      return next(
        createError(
          400,
          "Your account is already activated. Please login."
        )
      );
    }
    user.status = "active";
    await user.save();
    res
      .status(200)
      .json("Your account has been activated.");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User is deleted");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//get user for hotel employee
export const getHotelEmployee = async (req, res, next) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId and name === "Receptionist"
    const receptionists = await Role.find({
      hotelId: hotelId,
      name: "Receptionist",
    });
    const customers = await Role.find({
      name: "Customer",
    });
    //merge receptionists and customers
    const userId = [...receptionists, ...customers];
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: userId.map((role) => role._id),
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//get user by role id
export const getUserByRoleId = async (req, res, next) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId and name === "Receptionist"
    const receptionists = await Role.find({
      hotelId: hotelId,
      // name like Receptionist*
      name: { $regex: "Receptionist" },
    });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: receptionists.map((role) => role._id),
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//send mail to reset password
export const sendMailResetPassword = async (
  req,
  res,
  next
) => {
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

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, "Email is not exist"));
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.RESET_PASSWORD_KEY,
      { expiresIn: "20m" }
    );

    const url = `http://localhost:3000/profile/changepassword/${token}`;

    transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<h1>Click this link to reset password</h1>
      <a href="${url}">${url}</a>`,
    });
    res.status(200).send({
      message: `Reset link has been sent to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

//change password
export const changePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(createError(400, "User is not exist"));
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.RESET_PASSWORD_KEY,
      { expiresIn: "20m" }
    );

    const url = `http://localhost:3000/profile/changepassword/${token}`;

    res.status(200).send(url);
  } catch (error) {
    next(error);
  }
};

//update password
export const updatePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(400, "User is not exist"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    await user.save();
    res.status(200).json("Password is updated");
  } catch (error) {
    next(error);
  }
};

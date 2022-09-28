import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(
      createError("You are not authenticated!", 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError("Token is not valid", 403));
    }

    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(
        createError("You are not authorized", 403)
      );
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(
        createError("You are not our employee!", 403)
      );
    }
  });
};

export const verifyRole = (req, res, next) => {
  verifyToken(req, res, () => {
    // find user by id if role.name is Receptionist or Manager block them
    User.findById(req.user.id)
      .populate({ path: "roleId", select: "name" })
      .exec((err, user) => {
        if (err) {
          return next(createError("User not found!", 404));
        }
        if (
          user.roleId.name === "Receptionist" ||
          user.roleId.name === "Manager"
        ) {
          return next(
            createError(
              "You can not access this site!",
              403
            )
          );
        }
        next();
      });
  });
};

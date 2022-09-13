import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Order from "../models/Order.js";
import moment from "moment";

export const createBooking = async (req, res, next) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json("Booking is deleted");
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    // get booking sort status "open" first
    const bookings = await Booking.find()
      .populate({
        path: "userId",
        select: "username",
      })
      .sort({ status: -1 });
    const rooms = await Room.find();
    const roomNumbers = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        return {
          _id: roomNumber._id,
          number: roomNumber.number,
        };
      });
    });
    const roomNumbersFlat = roomNumbers.flat();
    const bookingRoomNumbers = bookings.map((booking) => {
      return {
        ...booking._doc,
        roomNumber: roomNumbersFlat.find(
          (roomNumber) =>
            roomNumber._id.toString() ===
            booking.roomId.toString()
        ).number,
      };
    });
    res.status(200).json(bookingRoomNumbers);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByRoomId = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      roomId: req.params.id,
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingsPaidThisMonth = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getIncomeThisMonth = async (
  req,
  res,
  next
) => {
  try {
    // get total of totalPaid of booking this month
    const bookings = await Booking.find({
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    const total = bookings.reduce((acc, booking) => {
      return acc + booking.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

export const getBookingsPaidLastMonth = async (
  req,
  res,
  next
) => {
  // paymentMethod is cash or online
  try {
    const bookings = await Booking.find({
      // paymentMethod is not unpaid
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ),
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ),
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getIncomeLastMonth = async (
  req,
  res,
  next
) => {
  try {
    // get total of totalPaid of booking last month
    const bookings = await Booking.find({
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ),
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ),
      },
    });
    const total = bookings.reduce((acc, booking) => {
      return acc + booking.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

export const getBookingByUserId = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.id,
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// get totalPaid of booking by userId today if paymentMethod is cash
export const getIncomeBookingByUserId = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      employeeId: req.params.id,
      paymentMethod: "cash",
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(
          new Date().setHours(23, 59, 59, 999)
        ),
      },
    });
    const total = bookings.reduce((acc, booking) => {
      return acc + booking.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

//get sum totalPaid of booking for each month in this year by booking.type = day or hour or both
export const getIncomeBookingByType = async (
  req,
  res,
  next
) => {
  try {
    // get finalizations of 6 months until now
    const finalizations = await Finalization.find({
      createdAt: {
        $gte: new Date(
          new Date().setMonth(new Date().getMonth() - 6)
        ),
        $lte: new Date(
          new Date().setMonth(new Date().getMonth())
        ),
      },
    });
    //for each month sum finalizations paid and unpaid
    const finalizationsPaidThisYear = finalizations.reduce(
      (acc, finalization) => {
        const month = finalization.createdAt.getMonth();
        // convert month to English
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(new Date(finalization.createdAt));

        if (!acc[month]) {
          acc[month] = {
            name: monthName,
            paid: 0,
            unpaid: 0,
            Total: 0,
          };
        }
        acc[month].paid += finalization.paid;
        acc[month].unpaid += finalization.unpaid;
        acc[month].Total =
          acc[month].paid + acc[month].unpaid;
        return acc;
      },
      {}
    );
    res.status(200).json(finalizationsPaidThisYear);
  } catch (error) {
    next(error);
  }
};

export const getFinalizationByUserId = async (
  req,
  res,
  next
) => {
  try {
    // get all bookingId by userId, then use bookingId to get finalization
    const bookings = await Booking.find({
      userId: req.params.id,
    });
    const finalizations = await Finalization.find({
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    res.status(200).json(finalizations);
  } catch (error) {
    next(error);
  }
};

// get sum of totalPaid of booking by employeeId for each month in last year if type is day or hour or both
export const getIncomeBookingByEmployeeIdLast = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in last year
      checkinDate: {
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
        $lte: new Date(new Date().getFullYear(), 0, 1),
      },
    });
    const income = bookings.reduce((acc, booking) => {
      const month = booking.checkinDate.getMonth();
      // format booking.checkinDate to "yyyy-mm"
      const monthName = moment(booking.checkinDate).format(
        "yyyy-MM"
      );

      if (!acc[month]) {
        acc[month] = {
          date: monthName,
          hour: 0,
          day: 0,
          total: 0,
        };
      }
      // if booking.type === hour
      if (booking.type === "hour") {
        acc[month].hour += booking.totalPaid;
      }
      // if booking.type === day
      if (booking.type === "day") {
        acc[month].day += booking.totalPaid;
      }
      acc[month].total = acc[month].hour + acc[month].day;
      return acc;
    }, {});
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

// get sum of totalPaid of booking by employeeId for each month in this year if type is day or hour or both
export const getIncomeBookingByEmployeeId = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in this year
      checkinDate: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lte: new Date(new Date().getFullYear(), 11, 31),
      },
    });
    const income = bookings.reduce((acc, booking) => {
      const month = booking.checkinDate.getMonth();
      // convert month to English
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(new Date(booking.checkinDate));

      if (!acc[month]) {
        acc[month] = {
          name: monthName,
          hour: 0,
          day: 0,
          total: 0,
        };
      }
      // if booking.type === hour
      if (booking.type === "hour") {
        acc[month].hour += booking.totalPaid;
      }
      // if booking.type === day
      if (booking.type === "day") {
        acc[month].day += booking.totalPaid;
      }
      acc[month].total = acc[month].hour + acc[month].day;
      return acc;
    }, {});
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

// get sum of totalPaid of booking by employeeId in this month split into 4 weeks if type is day or hour or both
export const getIncomeBookingByEmployeeIdThisMonth = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in last month
      checkinDate: {
        $gte: new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        ),
        $lte: new Date(
          new Date().setMonth(new Date().getMonth())
        ),
      },
    });
    const income = bookings.reduce((acc, booking) => {
      // split into 4 weeks
      const week = Math.ceil(
        booking.checkinDate.getDate() / 7
      );
      // set weekName = First Week, Second Week, Third Week, Fourth Week
      const weekName = `Week ${week}`;

      if (!acc[week]) {
        acc[week] = {
          name: weekName,
          hour: 0,
          day: 0,
          total: 0,
        };
      }
      // if booking.type === hour
      if (booking.type === "hour") {
        acc[week].hour += booking.totalPaid;
      }
      // if booking.type === day
      if (booking.type === "day") {
        acc[week].day += booking.totalPaid;
      }
      acc[week].total = acc[week].hour + acc[week].day;
      return acc;
    }, {});
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

// get sum of totalPaid of booking by employeeId in each day of last week if type is day or hour or both
export const getIncomeBookingByEmployeeIdThisWeek = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in last week
      checkinDate: {
        $gte: new Date(
          new Date().setDate(new Date().getDate() - 7)
        ),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    const income = bookings.reduce((acc, booking) => {
      const day = booking.checkinDate.getDate();
      // convert day to English
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(new Date(booking.checkinDate));

      if (!acc[day]) {
        acc[day] = {
          name: dayName,
          hour: 0,
          day: 0,
          total: 0,
        };
      }
      // if booking.type === hour
      if (booking.type === "hour") {
        acc[day].hour += booking.totalPaid;
      }
      // if booking.type === day
      if (booking.type === "day") {
        acc[day].day += booking.totalPaid;
      }
      acc[day].total = acc[day].hour + acc[day].day;
      return acc;
    }, {});
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

// get sum of totalPaid of booking by employeeId in each hour of yesterday if type is day or hour or both
export const getIncomeBookingByEmployeeIdYesterday = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });
    // get date yesterday
    const yesterday = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    // set yesterdayUTC to 00:00:00
    const yesterdayUTCStart = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        0,
        0,
        0
      )
    );
    // set yesterdayUTC to 23:59:59
    const yesterdayUTCEnd = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59
      )
    );

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in yesterday
      checkinDate: {
        $gte: yesterdayUTCStart,
        $lte: yesterdayUTCEnd,
      },
    });
    const income = bookings.reduce((acc, booking) => {
      // convert booking.checkinDate to UTC
      const hour = booking.checkinDate.getUTCHours();
      // convert hour to English +7 hours
      const hourName = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: true,
      }).format(
        new Date(
          booking.checkinDate.setHours(
            booking.checkinDate.getHours() - 7
          )
        )
      );

      if (!acc[hour]) {
        acc[hour] = {
          name: hourName,
          hour: 0,
          day: 0,
          total: 0,
        };
      }
      // if booking.type === hour
      if (booking.type === "hour") {
        acc[hour].hour += booking.totalPaid;
      }
      // if booking.type === day
      if (booking.type === "day") {
        acc[hour].day += booking.totalPaid;
      }
      acc[hour].total = acc[hour].hour + acc[hour].day;
      return acc;
    }, {});
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

//get all booking by employeeId yesterday
export const getBookingByEmployeeIdYesterday = async (
  req,
  res,
  next
) => {
  try {
    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const hotelId = role.hotelId;
    // get all role if hotelId === hotelId
    const roles = await Role.find({ hotelId: hotelId });
    // get all employeeId by roles.map(role => role._id)
    const users = await User.find({
      roleId: {
        $in: roles.map((role) => role._id),
      },
    });
    // get date yesterday
    const yesterday = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    // set yesterdayUTC to 00:00:00
    const yesterdayUTCStart = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        0,
        0,
        0
      )
    );
    // set yesterdayUTC to 23:59:59
    const yesterdayUTCEnd = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59
      )
    );

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      //checkinDate in yesterday from 00:00:00 to 23:59:59
      checkinDate: {
        $gte: yesterdayUTCStart,
        $lte: yesterdayUTCEnd,
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// get booking and order, count the number and sum of totalPaid of booking and order by employeeId of each month in this year
export const getIncomeBookingAndOrderByEmployeeIdThisYear =
  async (req, res, next) => {
    try {
      // get roldId by userId
      const user = await User.findById(req.params.id);
      const roleId = user.roleId;
      // get hotelId by roleId
      const role = await Role.findById(roleId);
      const hotelId = role.hotelId;
      // get all role if hotelId === hotelId
      const roles = await Role.find({ hotelId: hotelId });
      // get all employeeId by roles.map(role => role._id)
      const users = await User.find({
        roleId: {
          $in: roles.map((role) => role._id),
        },
      });
      // get date this year
      const thisYear = new Date();
      // set thisYearUTC to 00:00:00
      const thisYearUTCStart = new Date(
        Date.UTC(thisYear.getFullYear(), 0, 1, 0, 0, 0)
      );
      // set thisYearUTC to 23:59:59
      const thisYearUTCEnd = new Date(
        Date.UTC(thisYear.getFullYear(), 11, 31, 23, 59, 59)
      );

      const bookings = await Booking.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        // checkinDate in this year
        checkinDate: {
          $gte: thisYearUTCStart,
          $lte: thisYearUTCEnd,
        },
      });
      const orders = await Order.find({
        bookingId: {
          $in: bookings.map((booking) => booking._id),
        },
      });
      const income = bookings.reduce((acc, booking) => {
        // convert booking.checkinDate to UTC
        const month = booking.checkinDate.getUTCMonth();
        // convert month to English
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(new Date(booking.checkinDate));

        if (!acc[month]) {
          acc[month] = {
            name: monthName,
            booking: 0,
            totalIncomeBooking: 0,
            order: 0,
            totalIncomeOrder: 0,
            total: 0,
          };
        }
        // get count booking and order, sum totalPaid of booking and order
        acc[month].booking += 1;
        acc[month].totalIncomeBooking += booking.totalPaid;
        acc[month].order += orders.filter(
          (order) =>
            order.bookingId.toString() ===
            booking._id.toString()
        ).length;
        acc[month].totalIncomeOrder += orders
          .filter(
            (order) =>
              order.bookingId.toString() ===
              booking._id.toString()
          )
          .reduce(
            (acc, order) => acc + order.totalPrice,
            0
          );
        acc[month].total =
          acc[month].totalIncomeBooking +
          acc[month].totalIncomeOrder;
        return acc;
      }, {});
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

// get booking and order, count the number and sum of totalPaid of booking and order by employeeId of each month in last year
export const getIncomeBookingAndOrderByEmployeeIdLastYear =
  async (req, res, next) => {
    try {
      // get roldId by userId
      const user = await User.findById(req.params.id);
      const roleId = user.roleId;
      // get hotelId by roleId
      const role = await Role.findById(roleId);
      const hotelId = role.hotelId;
      // get all role if hotelId === hotelId
      const roles = await Role.find({ hotelId: hotelId });
      // get all employeeId by roles.map(role => role._id)
      const users = await User.find({
        roleId: {
          $in: roles.map((role) => role._id),
        },
      });
      // get date this year
      const thisYear = new Date();
      // set thisYearUTC to 00:00:00
      const thisYearUTCStart = new Date(
        Date.UTC(thisYear.getFullYear() - 1, 0, 1, 0, 0, 0)
      );
      // set thisYearUTC to 23:59:59
      const thisYearUTCEnd = new Date(
        Date.UTC(
          thisYear.getFullYear() - 1,
          11,
          31,
          23,
          59,
          59
        )
      );

      const bookings = await Booking.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        // checkinDate in this year
        checkinDate: {
          $gte: thisYearUTCStart,
          $lte: thisYearUTCEnd,
        },
      });
      const orders = await Order.find({
        bookingId: {
          $in: bookings.map((booking) => booking._id),
        },
      });
      const income = bookings.reduce((acc, booking) => {
        // convert booking.checkinDate to UTC
        const month = booking.checkinDate.getUTCMonth();
        // convert month to English
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(new Date(booking.checkinDate));

        if (!acc[month]) {
          acc[month] = {
            name: monthName,
            booking: 0,
            totalIncomeBooking: 0,
            order: 0,
            totalIncomeOrder: 0,
            total: 0,
          };
        }
        // get count booking and order, sum totalPaid of booking and order
        acc[month].booking += 1;
        acc[month].totalIncomeBooking += booking.totalPaid;
        acc[month].order += orders.filter(
          (order) =>
            order.bookingId.toString() ===
            booking._id.toString()
        ).length;
        acc[month].totalIncomeOrder += orders
          .filter(
            (order) =>
              order.bookingId.toString() ===
              booking._id.toString()
          )
          .reduce(
            (acc, order) => acc + order.totalPrice,
            0
          );
        acc[month].total =
          acc[month].totalIncomeBooking +
          acc[month].totalIncomeOrder;
        return acc;
      }, {});
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

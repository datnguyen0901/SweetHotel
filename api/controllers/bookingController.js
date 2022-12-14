import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Order from "../models/Order.js";
import Finalization from "../models/Finalization.js";
import moment from "moment";
import dateFormat from "dateformat";
import crypto from "crypto";
import querystring from "qs";
import paypal from "paypal-rest-sdk";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AVNYzsI8sb-AfWOVr2xat7NZSqVDoDuElNplMPR8jH8yrCi_d7jEV5Lbz38aiKaZ6wMBcL0ztwqUWSzE",
  client_secret:
    "EDi0APVnGo3PWwaWfZS_Mbz9WuYDKc_HRAMRjEyH5vHItNzh9lglfC2qw9X0_ADg-PCdUNUaGfwiSXKF",
});

export const createBooking = async (req, res, next) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    return res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};

export const mailBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    const user = await User.findById(booking.userId);

    const checkInDate = dateFormat(
      booking.checkinDate,
      "dd/mm/yyyy"
    );

    const rooms = await Room.find();
    const roomNumbers = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        if (
          roomNumber._id.toString() ===
          booking.roomId.toString()
        ) {
          return room.hotelId;
        }
      });
    });
    // flat and filter the array
    const hotelId = roomNumbers
      .flat()
      .filter((room) => room !== undefined);
    const hotel = await Hotel.findOne({
      _id: hotelId,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const url = `http://localhost:5000/bookings/${booking._id}`;

    let img = "";
    let qr = await QRCode.toDataURL(url);
    img = `<image src= " ` + qr + `" />`;

    transporter.sendMail({
      to: user.email,
      subject: "Booking Information",
      attachDataUrls: true,
      html: `This is your booking code: ${booking._id}. Check-in Date: ${checkInDate} at ${hotel.name}. Please Check In after 14 p.m to make sure your room is ready. It's our pleasure to serve you.  <br> <br> <img src="' + ${img} `,
    });
    return res.status(201).send({
      message: `Sent a booking code to ${user.email}`,
    });
  } catch (err) {
    return res.status(500).send(err);
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

// get booking if checkinDate is passed and the status is waiting
export const getBookingIfCheckinDateIsPassed = async (
  req,
  res,
  next
) => {
  try {
    const day = moment().startOf("day").toDate();
    const today = moment(day).add(7, "hours");
    // because checkinDate on the database is GMT, but the user is in GMT+7
    const bookings = await Booking.find({
      checkinDate: {
        $lt: today,
      },
      status: "waiting",
    });
    res.status(200).json(bookings);
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
    //booking.roomId.toString()
    const bookingRoomNumbers = bookings.map((booking) => {
      return {
        ...booking._doc,
        roomNumber: roomNumbersFlat.find(
          (roomNumber) =>
            roomNumber._id.toString() ==
            booking.roomId.toString()
        ).number,
      };
    });
    res.status(200).json(bookingRoomNumbers);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUser = async (req, res, next) => {
  try {
    // by userId status = open or waiting
    const bookings = await Booking.find({
      userId: req.params.id,
      status: { $in: ["open", "waiting"] },
    }).sort({ status: -1 });
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
            roomNumber._id.toString() ==
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

//get booking by hotelId
export const getBookingsByHotelId = async (
  req,
  res,
  next
) => {
  try {
    // get all roomNumbers _id by hotelId
    const rooms = await Room.find({
      hotelId: req.params.id,
    });
    const roomNumbers = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        return {
          _id: roomNumber._id,
          number: roomNumber.number,
        };
      });
    });
    const roomNumbersFlat = roomNumbers.flat();
    // get all bookings by roomNumbers _id
    const bookings = await Booking.find({
      roomId: { $in: roomNumbersFlat },
    }).sort({ status: -1 });
    const bookingRoomNumbers = bookings.map((booking) => {
      return {
        ...booking._doc,
        roomNumber: roomNumbersFlat.find(
          (roomNumber) =>
            roomNumber._id.toString() ==
            booking.roomId.toString()
        ).number,
      };
    });
    res.status(200).json(bookingRoomNumbers);
  } catch (error) {
    next(error);
  }
};

export const replaceBookingsByRoomId = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      roomId: req.params.id,
    });
    // update roomId to 632aabf237a27bae8e547831 in all bookings
    bookings.forEach(async (booking) => {
      await Booking.findByIdAndUpdate(
        booking._id,
        { $set: { roomId: "632aabf237a27bae8e547833" } },
        { new: true }
      );
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(
      obj[str[key]]
    ).replace(/%20/g, "+");
  }
  return sorted;
}

export const bookingVnPay = async (req, res, next) => {
  try {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const tmnCode = "0XYGSHRC";
    const secretKey = "XRZSFEZFZKBNXDWXGEHSGRFNEOXFKUKW";
    let vnpUrl =
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl =
      "http://localhost:8800/api/bookings/onlinepayment/vnpay_return";

    //we have to add 1 more hour to the current time to fix with the VNPAY server
    let date = new Date();
    date.setHours(date.getHours() + 1);

    let createDate = dateFormat(date, "yyyymmddHHmmss");
    let amount = parseFloat(req.body.amount);
    let orderInfo = req.body.orderInfo;
    let orderType = req.body.orderType;
    let bookingId = req.body.bookingId;
    let locale = req.body.locale;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = bookingId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl; // return booking page
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, {
      encode: false,
    });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl +=
      "?" +
      querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json(vnpUrl);
  } catch (error) {
    next(error);
  }
};

export const bookingVnPayReturn = async (
  req,
  res,
  next
) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];
  let bookingId = vnp_Params["vnp_TxnRef"];
  let transactionId = vnp_Params["vnp_TransactionNo"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = "XRZSFEZFZKBNXDWXGEHSGRFNEOXFKUKW";

  let signData = querystring.stringify(vnp_Params, {
    encode: false,
  });

  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With"
    );
    Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentMethod: "online",
        onlinePaymentId: transactionId,
        onlinePaymentDate: Date.now(),
        note: "Payment success by VnPAY",
      },
      { new: true }
    ).then((booking) => {
      res.redirect("http://localhost:3000/booking/success");
    });
  }
};

export const bookingVnPayIPN = async (req, res, next) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = "XRZSFEZFZKBNXDWXGEHSGRFNEOXFKUKW";

  let signData = querystring.stringify(vnp_Params, {
    encode: false,
  });

  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash === signed) {
    let bookingId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With"
    );
    res
      .status(200)
      .json({ RspCode: "00", Message: "success" });
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With"
    );
    res
      .status(200)
      .json({ RspCode: "97", Message: "Fail checksum" });
  }
};

export const bookingPaypalPay = async (req, res, next) => {
  try {
    const bookingId = req.body.sku;
    let create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:8800/api/bookings/onlinepayment/paypal/success/${bookingId}`,
        cancel_url:
          "http://localhost:8800/api/bookings/onlinepayment/paypal/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: req.body.name,
                sku: req.body.sku,
                price: req.body.price,
                currency: req.body.currency,
                quantity: req.body.quantity,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: req.body.price,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(
      create_payment_json,
      function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (const element of payment.links) {
            if (element.rel === "approval_url") {
              return res.status(200).json(element.href);
            }
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const bookingPaypalPaySuccess = async (
  req,
  res,
  next
) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: booking.totalPaid,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          res.redirect(
            "http://localhost:3000/booking/cancel"
          );
        } else {
          Booking.findByIdAndUpdate(
            bookingId,
            {
              paymentMethod: "online",
              onlinePaymentId: paymentId,
              onlinePaymentDate: Date.now(),
              note: "Payment success by Paypal",
            },
            { new: true }
          ).then((booking) => {
            res.redirect(
              "http://localhost:3000/booking/success"
            );
          });
        }
      }
    );
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
  const yesterdayUTCStart = moment()
    .subtract(1, "days")
    .startOf("day")
    .toDate();
  const yesterdayUTCEnd = moment()
    .subtract(1, "days")
    .endOf("day")
    .toDate();

  try {
    const bookings = await Booking.find({
      employeeId: req.params.id,
      paymentMethod: "cash",
      createdAt: {
        $gte: yesterdayUTCStart,
        $lte: yesterdayUTCEnd,
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

    // set lastMonthUTCStart to the first day of this month
    const lastMonthStart = moment()
      .startOf("month")
      .toDate();
    const lastMonthUTCStart = moment(lastMonthStart).add(
      7,
      "hours"
    );

    // set lastMonthUTCEnd to 23:59:59
    const lastMonthEnd = moment().endOf("month").toDate();
    const lastMonthUTCEnd = moment(lastMonthEnd).add(
      7,
      "hours"
    );

    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      // checkinDate in this year
      checkinDate: {
        $lte: lastMonthUTCEnd,
        $gte: lastMonthUTCStart,
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

// get sum of totalPaid of booking by employeeId in each day of this week if type is day or hour or both
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

    // set lastWeekUTCStart to monday 00:00:00 last week
    const lastWeekStart = moment().startOf("week").toDate();
    const lastWeekUTCStart = moment(lastWeekStart).add(
      7,
      "hours"
    );
    // set lastWeekUTCEnd to sunday 23:59:59 last week
    const lastWeekEnd = moment().endOf("week").toDate();
    const lastWeekUTCEnd = moment(lastWeekEnd).add(
      7,
      "hours"
    );
    // get all booking by users.map(user => user._id)
    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      checkinDate: {
        $gte: lastWeekUTCStart,
        $lte: lastWeekUTCEnd,
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
    const yesterdayStart = moment()
      .subtract(1, "days")
      .startOf("day")
      .toDate();
    const yesterdayUTCStart = moment(yesterdayStart).add(
      7,
      "hours"
    );
    const yesterdayEnd = moment()
      .subtract(1, "days")
      .endOf("day")
      .toDate();
    const yesterdayUTCEnd = moment(yesterdayEnd).add(
      7,
      "hours"
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
    const yesterdayStart = moment()
      .subtract(1, "days")
      .startOf("day")
      .toDate();
    const yesterdayUTCStart = moment(yesterdayStart).add(
      7,
      "hours"
    );
    const yesterdayEnd = moment()
      .subtract(1, "days")
      .endOf("day")
      .toDate();
    const yesterdayUTCEnd = moment(yesterdayEnd).add(
      7,
      "hours"
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
          .reduce((acc, order) => acc + order.totalPaid, 0);
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
          .reduce((acc, order) => acc + order.totalPaid, 0);
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

// get booking and order, count the number and sum of totalPaid of booking and order by employeeId of 4 weeks in last month
export const getIncomeBookingAndOrderByEmployeeIdLastMonth =
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
      // set lastMonthUTCStart to the first day of last month
      const lastMonthStart = moment()
        .subtract(1, "months")
        .startOf("month")
        .toDate();
      const lastMonthUTCStart = moment(lastMonthStart).add(
        7,
        "hours"
      );

      // set lastMonthUTCEnd to 23:59:59
      const lastMonthEnd = moment()
        .subtract(1, "months")
        .endOf("month")
        .toDate();
      const lastMonthUTCEnd = moment(lastMonthEnd).add(
        7,
        "hours"
      );

      const bookings = await Booking.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        // checkinDate in this year
        checkinDate: {
          $lte: lastMonthUTCEnd,
          $gte: lastMonthUTCStart,
        },
      });
      const orders = await Order.find({
        bookingId: {
          $in: bookings.map((booking) => booking._id),
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
            booking: 0,
            totalIncomeBooking: 0,
            order: 0,
            totalIncomeOrder: 0,
            total: 0,
          };
        }
        // get count booking and order, sum totalPaid of booking and order
        acc[week].booking += 1;
        acc[week].totalIncomeBooking += booking.totalPaid;
        acc[week].order += orders.filter(
          (order) =>
            order.bookingId.toString() ===
            booking._id.toString()
        ).length;
        acc[week].totalIncomeOrder += orders
          .filter(
            (order) =>
              order.bookingId.toString() ===
              booking._id.toString()
          )
          .reduce((acc, order) => acc + order.totalPaid, 0);
        acc[week].total =
          acc[week].totalIncomeBooking +
          acc[week].totalIncomeOrder;
        return acc;
      }, {});
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

// get booking and order, count the number and sum of totalPaid of booking and order by employeeId of each day in last week
export const getIncomeBookingAndOrderByEmployeeIdLastWeek =
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

      // set lastWeekUTCStart to monday 00:00:00 last week
      const lastWeekStart = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .toDate();
      const lastWeekUTCStart = moment(lastWeekStart).add(
        7,
        "hours"
      );
      // set lastWeekUTCEnd to sunday 23:59:59 last week
      const lastWeekEnd = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .toDate();
      const lastWeekUTCEnd = moment(lastWeekEnd).add(
        7,
        "hours"
      );

      const bookings = await Booking.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        // checkinDate in this year
        checkinDate: {
          $gte: lastWeekUTCStart,
          $lte: lastWeekUTCEnd,
        },
      });
      const orders = await Order.find({
        bookingId: {
          $in: bookings.map((booking) => booking._id),
        },
        createdAt: {
          $gte: lastWeekStart,
          $lte: lastWeekEnd,
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
            booking: 0,
            totalIncomeBooking: 0,
            order: 0,
            totalIncomeOrder: 0,
            total: 0,
          };
        }
        // get count booking and order, sum totalPaid of booking and order
        acc[day].booking += 1;
        acc[day].totalIncomeBooking += booking.totalPaid;
        acc[day].order += orders.filter(
          (order) =>
            order.bookingId.toString() ===
            booking._id.toString()
        ).length;
        acc[day].totalIncomeOrder += orders
          .filter(
            (order) =>
              order.bookingId.toString() ===
              booking._id.toString()
          )
          .reduce((acc, order) => acc + order.totalPaid, 0);
        acc[day].total =
          acc[day].totalIncomeBooking +
          acc[day].totalIncomeOrder;
        return acc;
      }, {});
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

// get booking and order, count the number and sum of totalPaid of booking and order by employeeId of each hour in yesterday
export const getIncomeBookingAndOrderByEmployeeIdYesterday =
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
      const yesterdayUTCStart = moment()
        .subtract(1, "days")
        .startOf("day")
        .toDate();
      const yesterdayUTCEnd = moment()
        .subtract(1, "days")
        .endOf("day")
        .toDate();
      const bookings = await Booking.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        createdAt: {
          $gte: yesterdayUTCStart,
          $lte: yesterdayUTCEnd,
        },
      });
      const orders = await Order.find({
        employeeId: {
          $in: users.map((user) => user._id),
        },
        createdAt: {
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
            booking: 0,
            totalIncomeBooking: 0,
            order: 0,
            totalIncomeOrder: 0,
            total: 0,
          };
        }
        // get count booking and order, sum totalPaid of booking and order
        acc[hour].booking += 1;
        acc[hour].totalIncomeBooking += booking.totalPaid;
        acc[hour].order += orders.filter(
          (order) =>
            order.bookingId.toString() ===
            booking._id.toString()
        ).length;
        acc[hour].totalIncomeOrder += orders
          .filter(
            (order) =>
              order.bookingId.toString() ===
              booking._id.toString()
          )
          .reduce((acc, order) => acc + order.totalPaid, 0);
        acc[hour].total =
          acc[hour].totalIncomeBooking +
          acc[hour].totalIncomeOrder;
        return acc;
      }, {});
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

// get booking and order, finalization by employeeId(cash) today
export const getIncomeBookingAndOrderByEmployeeIdToday =
  async (req, res, next) => {
    try {
      const todayUTCStart = moment()
        .subtract(1, "days")
        .startOf("day")
        .toDate();
      const todayUTCEnd = moment()
        .subtract(1, "days")
        .endOf("day")
        .toDate();

      // get all booking and order by employeeId today by createdAt
      const bookings = await Booking.find({
        employeeId: req.params.id,
        paymentMethod: "cash",
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "booking" to booking
      const bookingsWithCheckingType = bookings.map(
        (booking) => ({
          ...booking._doc,
          checkingType: "booking",
        })
      );
      const orders = await Order.find({
        employeeId: req.params.id,
        paymentMethod: "cash",
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "order" to order
      const ordersWithCheckingType = orders.map(
        (order) => ({
          ...order._doc,
          checkingType: "order",
        })
      );
      const finalizations = await Finalization.find({
        employeeId: req.params.id,
        paymentMethod: "cash",
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "finalization" to finalization
      const finalizationsWithCheckingType =
        finalizations.map((finalization) => ({
          ...finalization._doc,
          checkingType: "finalization",
        }));
      // calculate totalPaid of booking, order, finalization
      const totalIncomeBooking = bookings.reduce(
        (acc, booking) => acc + booking.totalPaid,
        0
      );
      const totalIncomeOrder = orders.reduce(
        (acc, order) => acc + order.totalPrice,
        0
      );
      const totalIncomeFinalization = finalizations.reduce(
        (acc, finalization) => acc + finalization.unpaid,
        0
      );
      const totalIncome =
        totalIncomeBooking +
        totalIncomeOrder +
        totalIncomeFinalization;
      //merge bookingsWithCheckingType and ordersWithCheckingType and finalizationsWithCheckingType
      const income = [
        ...bookingsWithCheckingType,
        ...ordersWithCheckingType,
        ...finalizationsWithCheckingType,
      ];
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

// get income online yesterday
export const getIncomeOnlineToday = async (
  req,
  res,
  next
) => {
  try {
    const yesterdayUTCStart = moment()
      .subtract(1, "days")
      .startOf("day")
      .toDate();
    const yesterdayUTCEnd = moment()
      .subtract(1, "days")
      .endOf("day")
      .toDate();

    // get roldId by userId
    const user = await User.findById(req.params.id);
    const roleId = user.roleId;
    // get hotelId by roleId
    const role = await Role.findById(roleId);
    const rooms = await Room.find({
      hotelId: role.hotelId,
    });
    const roomNumbers = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        return {
          _id: roomNumber._id,
          number: roomNumber.number,
        };
      });
    });
    const roomNumbersFlat = roomNumbers.flat();
    // get all bookings by roomNumbers _id
    const bookings = await Booking.find({
      roomId: { $in: roomNumbersFlat },
      onlinePaymentDate: {
        $gte: yesterdayUTCStart,
        $lte: yesterdayUTCEnd,
      },
    });
    const bookingRoomNumbers = bookings.map((booking) => {
      return {
        ...booking._doc,
        roomNumber: roomNumbersFlat.find(
          (roomNumber) =>
            roomNumber._id.toString() ==
            booking.roomId.toString()
        ).number,
      };
    });
    res.status(200).json(bookingRoomNumbers);
  } catch (error) {
    next(error);
  }
};

// get booking and order, finalization by employeeId(not by cash) today
export const getIncomeBookingAndOrderByEmployeeIdNotCashToday =
  async (req, res, next) => {
    try {
      const todayUTCStart = moment()
        .subtract(1, "days")
        .startOf("day")
        .toDate();
      const todayUTCEnd = moment()
        .subtract(1, "days")
        .endOf("day")
        .toDate();

      // get all booking and order by employeeId today by createdAt
      const bookings = await Booking.find({
        employeeId: req.params.id,
        // paymentMethod not equal cash and unpaid
        paymentMethod: { $ne: "cash" && "unpaid" },
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "booking" to booking
      const bookingsWithCheckingType = bookings.map(
        (booking) => ({
          ...booking._doc,
          checkingType: "booking",
        })
      );
      const orders = await Order.find({
        employeeId: req.params.id,
        paymentMethod: { $ne: "cash" || "unpaid" },
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "order" to order
      const ordersWithCheckingType = orders.map(
        (order) => ({
          ...order._doc,
          checkingType: "order",
        })
      );
      const finalizations = await Finalization.find({
        employeeId: req.params.id,
        paymentMethod: { $ne: "cash" },
        createdAt: {
          $gte: todayUTCStart,
          $lte: todayUTCEnd,
        },
      });
      // add checkingType = "finalization" to finalization
      const finalizationsWithCheckingType =
        finalizations.map((finalization) => ({
          ...finalization._doc,
          checkingType: "finalization",
        }));
      //merge bookingsWithCheckingType and ordersWithCheckingType and finalizationsWithCheckingType
      const income = [
        ...bookingsWithCheckingType,
        ...ordersWithCheckingType,
        ...finalizationsWithCheckingType,
      ];
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

export const getBookingMoneyPayByEachHotelOnlinePayment =
  async (req, res, next) => {
    try {
      const yesterdayUTCStart = moment()
        .subtract(1, "days")
        .startOf("day")
        .toDate();
      const yesterdayUTCEnd = moment()
        .subtract(1, "days")
        .endOf("day")
        .toDate();
      // get roomId by hotelId
      const rooms = await Room.find()
        .populate("hotelId")
        .exec();
      const hotels = await Hotel.find();
      // get _id in roomNumbers of rooms
      const roomNumbersId = rooms.map((room) =>
        room.roomNumbers.map(
          (
            roomNumber // return roomNumber._id and room.hotelId
          ) => ({
            roomNumberId: roomNumber._id,
            hotelId: room.hotelId._id,
          })
        )
      );

      // flat roomNumbersId
      const flatRoomNumbersId = roomNumbersId.flat();
      // get all bookings by roomNumbers _id
      const bookings = await Booking.find({
        paymentMethod: "online",
        onlinePaymentDate: {
          $gte: yesterdayUTCStart,
          $lte: yesterdayUTCEnd,
        },
      });
      // get totalPaid of booking by roomId filter by hotel name
      const income = hotels.map((hotel) => {
        const totalPaid = bookings
          .filter((booking) =>
            flatRoomNumbersId.find(
              (roomNumberId) =>
                roomNumberId.roomNumberId.toString() ===
                  booking.roomId.toString() &&
                roomNumberId.hotelId.toString() ===
                  hotel._id.toString()
            )
          )
          .reduce(
            (acc, booking) => acc + booking.totalPaid,
            0
          );
        return {
          hotelId: hotel._id,
          name: hotel.name,
          totalPaid,
        };
      });
      res.status(200).json(income);
    } catch (error) {
      next(error);
    }
  };

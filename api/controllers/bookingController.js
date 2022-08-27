import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

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
    const bookings = await Booking.find().populate({
      path: "userId",
      select: "username",
    });
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

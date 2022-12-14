import Booking from "../models/Booking.js";
import Finalization from "../models/Finalization.js";
import Room from "../models/Room.js";
import moment from "moment";

export const createFinalization = async (
  req,
  res,
  next
) => {
  const newFinalization = new Finalization(req.body);

  try {
    const savedFinalization = await newFinalization.save();
    res.status(200).json(savedFinalization);
  } catch (error) {
    next(error);
  }
};

export const updateFinalization = async (
  req,
  res,
  next
) => {
  try {
    const updatedFinalization =
      await Finalization.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
    res.status(200).json(updatedFinalization);
  } catch (error) {
    next(error);
  }
};

export const deleteFinalization = async (
  req,
  res,
  next
) => {
  try {
    await Finalization.findByIdAndDelete(req.params.id);
    res.status(200).json("Finalization is deleted");
  } catch (error) {
    next(error);
  }
};

//get all finalizations by all booking in employee hotel
export const getFinalizationsByAllBookingInHotel = async (
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
        return roomNumber._id;
      });
    });
    const roomNumbersFlat = roomNumbers.flat();
    // get all bookings by roomNumbers _id
    const bookings = await Booking.find({
      roomId: { $in: roomNumbersFlat },
    });
    const bookingIds = bookings.map((booking) => {
      return booking._id;
    });
    // get all finalizations by bookingIds
    const finalizations = await Finalization.find({
      bookingId: { $in: bookingIds },
    });
    res.status(200).json(finalizations);
  } catch (error) {
    next(error);
  }
};

export const getFinalization = async (req, res, next) => {
  try {
    const finalization = await Finalization.findById(
      req.params.id
    );
    res.status(200).json(finalization);
  } catch (error) {
    next(error);
  }
};

export const getFinalizations = async (req, res, next) => {
  try {
    const finalizations = await Finalization.find();
    res.status(200).json(finalizations);
  } catch (error) {
    next(error);
  }
};

export const getFinalizationsPaidThisMonth = async (
  req,
  res,
  next
) => {
  try {
    const finalizations = await Finalization.find({
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    res.status(200).json(finalizations);
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
    // get total of totalPaid of finalization this month
    const finalizations = await Finalization.find({
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    const total = finalizations.reduce(
      (acc, finalization) => {
        return acc + finalization.unpaid;
      },
      0
    );
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

export const getFinalizationsPaidLastMonth = async (
  req,
  res,
  next
) => {
  // paymentMethod is cash or online
  try {
    const finalizations = await Finalization.find({
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
    res.status(200).json(finalizations);
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
    // get total of totalPaid of finalization last month
    const finalizations = await Finalization.find({
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
    const total = finalizations.reduce(
      (acc, finalization) => {
        return acc + finalization.unpaid;
      },
      0
    );
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

// get sum finalizations paid and unpaid for each month in this year
export const getFinalizationsPaidThisYear = async (
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
    }).limit(6);
    res.status(200).json(finalizations);
  } catch (error) {
    next(error);
  }
};

// use getFinalizationByUserId get sum paid and unpaid for each month in this year
export const getFinalizationsPaidThisYearByUserId = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.id,
    });
    // get finalizations of 6 months until now
    const finalizations = await Finalization.find({
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
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
      (accUser, finalization) => {
        const month = finalization.createdAt.getMonth();
        // convert month to English
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(new Date(finalization.createdAt));

        if (!accUser[month]) {
          accUser[month] = {
            name: monthName,
            paid: 0,
            unpaid: 0,
            Total: 0,
          };
        }
        accUser[month].paid += finalization.paid;
        accUser[month].unpaid += finalization.unpaid;
        accUser[month].Total =
          accUser[month].paid + accUser[month].unpaid;
        return accUser;
      },
      {}
    );
    res.status(200).json(finalizationsPaidThisYear);
  } catch (error) {
    next(error);
  }
};

// get unpaid of booking by userId today if paymentMethod is cash
export const getUnpaidByUserIdToday = async (
  req,
  res,
  next
) => {
  const yesterdayStart = moment()
  .startOf("day")
  .toDate();
const yesterday = moment(yesterdayStart).add(
  7,
  "hours"
);
const yesterdayEnd = moment()
  .endOf("day")
  .toDate();
const today = moment(yesterdayEnd).add(
  7,
  "hours"
);
  try {
    const finalizations = await Finalization.find({
      employeeId: req.params.id,
      paymentMethod: "cash",
      createdAt: {
        $gte: yesterday,
        $lte: today,
      },
    });
    const total = finalizations.reduce(
      (acc, finalization) => {
        return acc + finalization.unpaid;
      },
      0
    );
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

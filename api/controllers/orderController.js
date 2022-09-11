import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

export const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order is deleted");
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

//get all orders for a specific Order
export const getOrdersByBooking = async (
  req,
  res,
  next
) => {
  try {
    const orders = await Order.find({
      bookingId: req.params.id,
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrdersPaidThisMonth = async (
  req,
  res,
  next
) => {
  try {
    const orders = await Order.find({
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    res.status(200).json(orders);
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
    // get total of totalPaid of Order this month
    const orders = await Order.find({
      paymentMethod: { $ne: "unpaid" },
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
        $lte: new Date(
          new Date().setDate(new Date().getDate())
        ),
      },
    });
    const total = orders.reduce((acc, order) => {
      return acc + order.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

export const getOrdersPaidLastMonth = async (
  req,
  res,
  next
) => {
  // paymentMethod is cash or online
  try {
    const orders = await Order.find({
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
    res.status(200).json(orders);
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
    // get total of totalPaid of Order last month
    const orders = await Order.find({
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
    const total = orders.reduce((acc, order) => {
      return acc + order.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

// get 5 order sorted by createdAt desc
export const getOrdersLatest = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: "waiting" })
      .sort({ createdAt: 1 })
      .limit(5);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice of booking by userId today if paymentMethod is cash
export const getIncomeOrderByUserId = async (
  req,
  res,
  next
) => {
  try {
    const orders = await Order.find({
      employeeId: req.params.id,
      paymentMethod: "cash",
      status: "done",
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(
          new Date().setHours(23, 59, 59, 999)
        ),
      },
    });
    const total = orders.reduce((acc, order) => {
      return acc + order.totalPrice;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of each type of service in order in this year
export const getIncomeByService = async (
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
    // get all booking by users.map(user => user._id)
    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      checkinDate: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lte: new Date(new Date().getFullYear(), 11, 31),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const services = await Service.find();
    // get sum of totalPrice and quantity of each service
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

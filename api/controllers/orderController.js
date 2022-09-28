import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Room from "../models/Room.js";

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
    const orders = await Order.find().sort({ status: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

//get all orders by all booking in employee hotel
export const getOrdersByAllBookingInHotel = async (
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
    // get all orders by bookingIds, sort by status
    const orders = await Order.find(
      {
        bookingId: { $in: bookingIds },
      },
      null,
      { sort: { status: -1 } }
    );
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// get 5 order sorted by createdAt desc
export const getOrdersLatest = async (req, res, next) => {
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
    // get all orders by bookingIds, sort by status
    const orders = await Order.find(
      {
        bookingId: { $in: bookingIds },
      },
      null,
      { sort: { status: -1 } }
    ).limit(5);
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
      return acc + order.totalPaid;
    }, 0);
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = service in order in this year by bookingId
export const getIncomeByServiceThisYear = async (
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
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "service")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = food in order in this year by bookingId
export const getIncomeByFoodThisYear = async (
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
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "food")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = drink in order in this year by bookingId
export const getIncomeByDrinkThisYear = async (
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
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "drink")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = service in order in last year by bookingId
export const getIncomeByServiceLastYear = async (
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
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
        $lte: new Date(
          new Date().getFullYear() - 1,
          11,
          31
        ),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "service")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = food in order in last year by bookingId
export const getIncomeByFoodLastYear = async (
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
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
        $lte: new Date(
          new Date().getFullYear() - 1,
          11,
          31
        ),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "food")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity of type = drink in order in last year by bookingId
export const getIncomeByDrinkLastYear = async (
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
        $gte: new Date(new Date().getFullYear() - 1, 0, 1),
        $lte: new Date(
          new Date().getFullYear() - 1,
          11,
          31
        ),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services
      .filter((service) => service.type === "drink")
      .map((service) => {
        return {
          name: service.name,
          type: service.type,
          quantity: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return acc + serviceOrder.quantity;
            }, 0),
          price: service.price,
          // total = quantity * price
          total: serviceOrders
            .filter(
              (serviceOrder) =>
                serviceOrder.serviceId.toString() ===
                service._id.toString()
            )
            .reduce((acc, serviceOrder) => {
              return (
                acc + serviceOrder.quantity * service.price
              );
            }, 0),
        };
      });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity by name in service in order in last month by bookingId
export const getIncomeByServiceLastMonth = async (
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
        $gte: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        ),
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          0
        ),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services.map((service) => {
      return {
        name: service.name,
        type: service.type,
        image: service.img,
        quantity: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return acc + serviceOrder.quantity;
          }, 0),
        price: service.price,
        // total = quantity * price
        total: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return (
              acc + serviceOrder.quantity * service.price
            );
          }, 0),
      };
    });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity by name in service in order in last week by bookingId
export const getIncomeByServiceLastWeek = async (
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
        $gte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 7
        ),
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services.map((service) => {
      return {
        name: service.name,
        type: service.type,
        image: service.img,
        quantity: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return acc + serviceOrder.quantity;
          }, 0),
        price: service.price,
        // total = quantity * price
        total: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return (
              acc + serviceOrder.quantity * service.price
            );
          }, 0),
      };
    });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

// get totalPrice and quantity by name in service in order in yesterday by bookingId
export const getIncomeByServiceYesterday = async (
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
    // get all booking by users.map(user => user._id)
    const bookings = await Booking.find({
      employeeId: {
        $in: users.map((user) => user._id),
      },
      checkinDate: {
        $gte: yesterdayUTCStart,
        $lte: yesterdayUTCEnd,
      },
    });
    // get all order by bookings.map(booking => booking._id)
    const orders = await Order.find({
      status: "done",
      bookingId: {
        $in: bookings.map((booking) => booking._id),
      },
    });
    const serviceHotel = await Service.find({
      hotelId: hotelId,
    });
    const services = serviceHotel[0].storage;
    //get sum of quantity the serviceOrders make it flat data by name and type of service
    const serviceOrders = orders
      .map((order) => {
        return order.serviceOrders.map((serviceOrder) => {
          return {
            serviceId: serviceOrder.serviceId,
            quantity: serviceOrder.quantity,
          };
        });
      })
      .flat();

    const getServiceOrders = services.map((service) => {
      return {
        name: service.name,
        type: service.type,
        image: service.img,
        quantity: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return acc + serviceOrder.quantity;
          }, 0),
        price: service.price,
        // total = quantity * price
        total: serviceOrders
          .filter(
            (serviceOrder) =>
              serviceOrder.serviceId.toString() ===
              service._id.toString()
          )
          .reduce((acc, serviceOrder) => {
            return (
              acc + serviceOrder.quantity * service.price
            );
          }, 0),
      };
    });
    res.status(200).json(getServiceOrders);
  } catch (error) {
    next(error);
  }
};

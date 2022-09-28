import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoomAvailability = async (
  req,
  res,
  next
) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
          "roomNumbers.$.userID": req.body.userID,
        },
      }
    );
    res
      .status(200)
      .json({ message: "Room availability updated" });
  } catch (error) {
    next(error);
  }
};

// get roomNumbers from a room
export const getRoomNumbers = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room.roomNumbers);
  } catch (error) {
    next(error);
  }
};

// add Number into roomNumbers
export const addRoomNumber = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    const newRoomNumber = {
      number: req.body.number,
      unavailableDates: [],
    };
    room.roomNumbers.push(newRoomNumber);
    await room.save();
    res.status(200).json(room.roomNumbers);
  } catch (error) {
    next(error);
  }
};

// delete RoomAvailability
export const deleteRoomAvailability = async (
  req,
  res,
  next
) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $pullAll: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res
      .status(200)
      .json({ message: "Room availability deleted" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json("Room is deleted");
  } catch (error) {
    next(error);
  }
};

export const deleteRooms = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json("Room is deleted");
  } catch (error) {
    next(error);
  }
};

export const deleteRoomNumbers = async (req, res, next) => {
  const id = req.params.id;
  const roomId = req.params.roomId;
  try {
    await Room.findByIdAndUpdate(id, {
      $pull: {
        roomNumbers: { _id: roomId },
      },
    });

    res.status(200).json("RoomNumber is deleted");
  } catch (error) {
    next(error);
  }
};

//get number in roomNumbers by roomNumbersId
export const getRoomNumber = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    // get number and _id in roomNumbers by roomNumbersId
    const roomNumber = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        return {
          number: roomNumber.number,
          _id: roomNumber._id,
        };
      });
    });
    res.status(200).json(roomNumber);
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

// check room availability by hotelId today return roomNumber, price, maxPeople, roomtype, available, nextAvailableDate
export const getAvailableRoomsToday = async (
  req,
  res,
  next
) => {
  const hotelId = req.params.hotelid;
  const today = new Date();
  // convert today to GMT-7(minus 7 hours)
  const todayGMT7 = new Date(
    today.getTime() - 7 * 60 * 60 * 1000
  );
  try {
    const rooms = await Room.find({ hotelId: hotelId });
    const availableRooms = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        const unavailableDates =
          roomNumber.unavailableDates;
        const isAvailable = unavailableDates.every(
          (date) =>
            date.toISOString().split("T")[0] !==
            todayGMT7.toISOString().split("T")[0]
        );
        const nextDate = unavailableDates.find(
          (date) =>
            date.toISOString().split("T")[0] >
            todayGMT7.toISOString().split("T")[0]
        );
        return {
          _id: roomNumber._id,
          roomNumber: roomNumber.number,
          price: room.price,
          maxPeople: room.maxPeople,
          title: room.title,
          available: isAvailable,
          today: todayGMT7,
          nextUnavailableDate: nextDate ? nextDate : null,
        };
      });
    });
    // flat the array availableRooms
    const availableRoomsToday = availableRooms.flat();
    res.status(200).json(availableRoomsToday);
  } catch (error) {
    next(error);
  }
};

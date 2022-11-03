import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel is deleted");
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: {
        $gt: min - 1 || 0,
        $lt: max || 999,
      },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({
      type: "hotel",
    });
    const apartmentCount = await Hotel.countDocuments({
      type: "apartment",
    });
    const resortCount = await Hotel.countDocuments({
      type: "resort",
    });
    const villaCount = await Hotel.countDocuments({
      type: "villa",
    });
    const cabinCount = await Hotel.countDocuments({
      type: "cabin",
    });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {}
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// get all city of hotels if duplicate remove it
export const getHotelCities = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    const cities = hotels.map((hotel) => hotel.city);
    const uniqueCities = [...new Set(cities)];
    // convert data to array of object city : uniqueCities
    const list = uniqueCities.map((city) => {
      return { city: city };
    });
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

//test get hotel name by roomNumber._id
export const getHotelName = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    //return hotelId if roomNumber._id === req.params.id
    const hotelId = rooms.find((room) =>
      room.roomNumbers.filter(
        (roomNumber) => roomNumber._id == req.params.id
      )
    ).hotelId;
    const hotel = await Hotel.findOne({ _id: hotelId });
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// get hotelId by roomId in roomNumber
export const getHotelIdByRoomId = async (
  req,
  res,
  next
) => {
  try {
    // get _id of room by _id of roomNumber in roomNumber collection
    const rooms = await Room.find();
    const roomNumbers = rooms.map((room) => {
      return room.roomNumbers.map((roomNumber) => {
        if (roomNumber._id == req.params.id) {
          return room._id;
        }
      });
    });
    // // flat the array
    const roomIds = roomNumbers.flat();
    //delete null in roomIds
    const roomIdsFilter = roomIds.filter(
      (room) => room != null
    );
    // get hotelId by roomId in hotel collection
    const hotels = await Hotel.find();
    const hotelIds = hotels.map((hotel) => {
      return hotel.rooms.map((room) => {
        if (room == roomIdsFilter[0]) {
          return hotel._id;
        }
      });
    });
    // flat the array
    const hotelIdsFlat = hotelIds.flat();
    //delete null in hotelIds
    const hotelIdsFilter = hotelIdsFlat.filter(
      (hotel) => hotel != null
    );
    res.status(200).json(hotelIdsFilter);
  } catch (error) {
    next(error);
  }
};

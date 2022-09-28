import Service from "../models/Service.js";

export const createService = async (req, res, next) => {
  const newService = new Service(req.body);

  try {
    const savedService = await newService.save();
    res.status(200).json(savedService);
  } catch (error) {
    next(error);
  }
};

// add more service by id
export const addMoreServiceStorage = async (
  req,
  res,
  next
) => {
  try {
    await Service.updateOne(
      { hotelId: req.params.id },
      {
        $push: {
          storage: req.body.storage,
        },
      }
    );
    res.status(200).json({ message: "Service added" });
  } catch (error) {
    next(error);
  }
};

// get service in storage by service id in storage
export const getInfoServiceStorage = async (
  req,
  res,
  next
) => {
  try {
    const service = await Service.findOne({
      storage: { $elemMatch: { _id: req.params.id } },
    });
    const serviceInfo = service.storage.find(
      (service) => service._id == req.params.id
    );
    res.status(200).json(serviceInfo);
  } catch (error) {
    next(error);
  }
};

//get service type in storage
export const getServiceType = async (req, res, next) => {
  try {
    const service = await Service.find();
    const serviceType = service.map((service) => {
      return service.storage.map((service) => {
        return service.type;
      });
    });
    res.status(200).json(serviceType);
  } catch (error) {
    next(error);
  }
};

//get storage by hotelId = req.params.id in Service
export const getServiceStorage = async (req, res, next) => {
  try {
    const service = await Service.find({
      hotelId: req.params.id,
    });
    const storage = service[0].storage;
    res.status(200).json(storage);
  } catch (error) {
    next(error);
  }
};

//get service by hotelId = req.params.id in Service to check valid
export const getServiceStorageValid = async (
  req,
  res,
  next
) => {
  try {
    const service = await Service.find({
      hotelId: req.params.id,
    });
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

// update array in storage by id in service
export const updateServiceStorage = async (
  req,
  res,
  next
) => {
  try {
    // update in Service.storage
    await Service.updateOne(
      { storage: { $elemMatch: { _id: req.params.id } } },
      {
        $set: {
          "storage.$.name": req.body.name,
          "storage.$.desc": req.body.desc,
          "storage.$.price": req.body.price,
          "storage.$.type": req.body.type,
          "storage.$.img": req.body.img,
          "storage.$.quantity": req.body.quantity,
        },
      }
    );
    res.status(200).json({ message: "Service updated" });
  } catch (error) {
    next(error);
  }
};

// delete service in storage by id in service
export const deleteServiceStorage = async (
  req,
  res,
  next
) => {
  try {
    await Service.updateOne(
      { storage: { $elemMatch: { _id: req.params.id } } },
      {
        $pull: {
          storage: { _id: req.params.id },
        },
      }
    );
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json("Service is deleted");
  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

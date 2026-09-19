// get all properties
// get property based on id


import { Property } from "../models/propertymodel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

const getProperties = async (req, res) => {
  try {
    const totalCount = await Property.countDocuments();
    const features = new APIFeatures(Property.find().sort({ _id: -1 }), req.query)
      .filter()
      .search()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      totalProperties: totalCount,
      no_of_responses: doc.length,
      data: doc,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
  }
};

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      maximumGuests,
      price,
      images,
      image,
    } = req.body;

    const rawImages = images || image || [];
    const uploadedImages = [];
    if (Array.isArray(rawImages)) {
      for (const img of rawImages) {
        if (!img) continue;
        const fileContent = typeof img === "object" ? (img.url || img.public_id) : img;
        if (!fileContent) continue;
        if (typeof fileContent === "string" && (fileContent.startsWith("http://") || fileContent.startsWith("https://"))) {
          uploadedImages.push({ url: fileContent, public_id: `img_${Date.now()}` });
        } else {
          const result = await imagekit.upload({
            file: fileContent,
            fileName: `property_${Date.now()}.jpg`,
            folder: "property_images",
          });
          uploadedImages.push({ url: result.url, public_id: result.fileId });
        }
      }
    }

    const guestCount = Number(maximumGuests || maximumGuest) || 2;
    const formattedAmenities = Array.isArray(amenities)
      ? amenities.map((a) => (typeof a === "string" ? { name: a, icon: "info" } : { name: a.name || a.title || "amenity", icon: a.icon || "info" }))
      : [];

    const property = await Property.create({
      propertyName,
      description,
      propertyType: propertyType || "House",
      roomType: roomType || "anytype",
      extraInfo,
      address,
      amenities: formattedAmenities,
      checkInTime,
      checkOutTime,
      maximumGuests: guestCount,
      maximumGuest: guestCount,
      price: Number(price) || 500,
      images: uploadedImages,
      image: uploadedImages,
      userid: req.user.id || req.user._id,
    });

    res.status(201).json({ status: "success", data: property });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const property = await Property.find({ userid: userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

export {
  getProperties,
  getProperty,
  createProperty,
  getUsersProperties,
  getProperties as getproperty,
  getProperty as getPropertyById,
};
import slugify from "slugify";
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "Please provide a property name"],
    },

    description: {
        type: String,
        required: [true, "Please provide a property description"],
    },

    extrainfo: {
        type: String,
        default: "great power comes with greater responsibility as good service",
    },

    propertyType: {
        type: String,
        default: "House",
    },

    roomType: {
        type: String,
        default: "anytype",
    },

    maximumGuests: {
        type: Number,
        default: 2,
    },

    maximumGuest: {
        type: Number,
        default: 2,
    },

    amenities: [
        {
            name: {
                type: String,
            },
            icon: {
                type: String,
                default: "info",
            },
        },
    ],

    image: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],

    images: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],

    price: {
        type: Number,
        required: [true, "Please enter the price per night value"],
        default: 500,
    },

    address: {
        area: String,
        city: String,
        state: String,
        pincode: Number,
    },

    currentBooking: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "booking",
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date,
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    currentBookings: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "booking",
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date,
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    slug: String,

    checkInTime: {
        type: String,
        default: "12:00 PM",
    },

    checkOutTime: {
        type: String,
        default: "11:00 AM",
    },
});

// Create slug before saving
propertySchema.pre("save", function (next) {
    if (this.propertyName) {
        this.slug = slugify(this.propertyName, { lower: true });
    }
    if (typeof next === "function") next();
});

// Convert city to lowercase before saving
propertySchema.pre("save", function (next) {
    if (this.address && this.address.city) {
        this.address.city = this.address.city
            .toLowerCase()
            .replaceAll(" ", "");
    }
    if (typeof next === "function") next();
});

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

export { Property };
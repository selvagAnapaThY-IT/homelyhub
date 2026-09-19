import mongoose from "mongoose";
import "./propertymodel.js";
import "./usermodel.js";

const bookingSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: [true, "booking must be associated with a property"],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "booking must be associated with a user"],
        },

        price: {
            type: Number,
            required: [true, "booking must have a price"],
        },

        paid: {
            type: Boolean,
            default: true,
        },

        fromdate: {
            type: Date,
        },
        fromDate: {
            type: Date,
        },

        todate: {
            type: Date,
        },
        toDate: {
            type: Date,
        },

        guest: {
            type: Number,
        },
        guests: {
            type: Number,
        },

        numberofnights: {
            type: Number,
        },
        numberOfNights: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate("property");
    next();
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export { Booking };
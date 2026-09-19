import mongoose from "mongoose";

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

        todate: {
            type: Date,
        },

        guest: {
            type: Number,
        },

        numberofnights: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: "property",
        select: "maximumGuests image propertyName address",
    });
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };
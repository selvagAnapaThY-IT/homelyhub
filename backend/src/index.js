import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";
import { propertyRouter } from "./routes/propertyRouter.js";
import router from "./routes/userRoutes.js";
import { bookingRouter } from "./routes/bookingRoutes.js";

import { tripRouter } from "./routes/tripRouter.js";
const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));
app.use(cors({
    origin: ["https://homelyhubselva.netlify.app", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(cookieParser());
app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL || "http://localhost:5173",
    credentials: true,
}));
// Database
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listings", propertyRouter);
app.use("/api/v1/rent/booking", bookingRouter);
app.use("/api/v1/rent/trip", tripRouter);
// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
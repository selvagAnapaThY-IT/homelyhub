import express from "express";
const bookingRouter=express.Router();
import {getBookingsDetails,getUserBookings,createOrder,verifyPayment} from "../controllers/bookingController.js";
import { protect } from "../controllers/authController.js";

bookingRouter.post("/create-order",protect,createOrder);
bookingRouter.post("/verify-payment",protect,verifyPayment);
bookingRouter.get("/",protect,getUserBookings);
bookingRouter.get("/:id",protect,getBookingsDetails);

export{bookingRouter};
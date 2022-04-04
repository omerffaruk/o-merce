import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("This is to see if expressAsyncHandler is working at all.");
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x.product._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    console.log(newOrder);
    const order = await newOrder.save();
    res.status(201).send({ message: "Order created successfully", order });
    return;
  })
);

export default orderRouter;

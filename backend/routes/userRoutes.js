import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        res.send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send({ message: "User already exists" });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.send({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      if (password) {
        user.password = bcrypt.hashSync(password, 10);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;

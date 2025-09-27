import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  registerStaff,
  loginStaff,
  updateStaffProfile,
  getFrequentCustomers,
} from "../controllers/customerManagementController.js";

const userRouter = express.Router(); //use to create get,post, etc methods

//create post request

userRouter.get("/frequentCustomers", getFrequentCustomers);
userRouter.post("/signup", registerUser);
userRouter.post("/signup/staff", registerStaff);
userRouter.post("/login", loginUser);
userRouter.post("/login/staff", loginStaff);
userRouter.get("/:id", getUserById);
userRouter.post("/update", updateProfile);
userRouter.post("/update/staff", updateStaffProfile);

export default userRouter;

import express from "express";
import { dataSetBooking } from "../controllers/dataSetController.js";
import { main } from "../dataSet/seed.js";

const dataSetRouter = express.Router(); //use to create get,post, etc methods

//create post request

dataSetRouter.get("/booking", main);

export default dataSetRouter;

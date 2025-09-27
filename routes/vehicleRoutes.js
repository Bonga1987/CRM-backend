import express from "express";
import {
  addVehicle,
  updateVehicleActive,
  updateVehicle,
  getAvailableActiveVehicles,
  countActiveVehicles,
  countMaintainedVehicles,
  vehicleSearch,
  getVehicleById,
  getVehiclesInMaintenance,
  checkoutOfMaintenance,
  countRentedVehicles,
  getAllVehicles,
  getMostRentedVehicles,
  getPopularCategories,
  countTotalVehicleByCategory,
  getFilters,
} from "../controllers/vehicleManagementController.js";

const vehicleRouter = express.Router(); //use to create get,post, etc methods

//create post request
vehicleRouter.get("/countTotalVehicleByCategory", countTotalVehicleByCategory);
vehicleRouter.get("/", getAvailableActiveVehicles);
vehicleRouter.get("/mostRented", getMostRentedVehicles);
vehicleRouter.get("/All", getAllVehicles);
vehicleRouter.get("/countActiveVehicles", countActiveVehicles);
vehicleRouter.get("/countMaintainedVehicles", countMaintainedVehicles);
vehicleRouter.get("/countRentedVehicles", countRentedVehicles);
vehicleRouter.get("/popularCategories", getPopularCategories);
vehicleRouter.get("/maintenance", getVehiclesInMaintenance);
vehicleRouter.get("/filters", getFilters);
vehicleRouter.get("/:vehicleid", getVehicleById);
vehicleRouter.post("/add", addVehicle);
vehicleRouter.post("/updateisActive", updateVehicleActive);
vehicleRouter.post("/update", updateVehicle);
vehicleRouter.post("/maintenance/checkout", checkoutOfMaintenance);

export default vehicleRouter;

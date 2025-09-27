import client from "../Database/db.js";
import {
  addVehicleQuery,
  updateVehicleActiveQuery,
  updateVehicleQuery,
  getAvailableActiveVehiclesQuery,
  countActiveVehiclesQuery,
  countMaintainedVehiclesQuery,
  baseVehicleSearchQuery,
  getVehicleByIdQuery,
  checkoutOfMaintenanceQuery,
  getVehiclesInMaintenanceQuery,
  countRentedVehiclesQuery,
  getAllVehiclesQuery,
  getMostRentedVehiclesQuery,
  getPopularCategoriesQuery,
  countTotalVehicleByCategoryQuery,
  getFiltersQuery,
} from "../queries/vehicleManagementQuery.js";

const getVehiclesInMaintenance = async (req, res) => {
  try {
    const result = await client.query(getVehiclesInMaintenanceQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicles in maintenance retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retreiving vehicles in maintenance:", error.message);
    throw error;
  }
};

const checkoutOfMaintenance = async (req, res) => {
  try {
    const { vehicleid } = req.body;

    const result = await client.query(checkoutOfMaintenanceQuery, [vehicleid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log(
      "Vehicle checked out maintenance successfully: ",
      result.rows[0].vehicleid
    );
    res.send(result.rows);
  } catch (error) {
    console.error("Error checking vehicle out of maintenance:", error.message);
    throw error;
  }
};

const getAvailableActiveVehicles = async (req, res) => {
  try {
    const result = await client.query(getAvailableActiveVehiclesQuery);

    console.log("Vehicles retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retreiving vehicles:", error.message);
    throw error;
  }
};

const getMostRentedVehicles = async (req, res) => {
  try {
    const result = await client.query(getMostRentedVehiclesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Most rented vehicles retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving most rented vehicles:", error);
    throw error;
  }
};

const countTotalVehicleByCategory = async (req, res) => {
  try {
    const result = await client.query(countTotalVehicleByCategoryQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Total vehicle by category retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error total vehicle by category :", error);
    throw error;
  }
};

const getPopularCategories = async (req, res) => {
  try {
    const result = await client.query(getPopularCategoriesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Popular categories retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving popular categories:", error);
    throw error;
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const result = await client.query(getAllVehiclesQuery);

    console.log("All Vehicles retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retreiving all vehicles:", error.message);
    throw error;
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicleid = parseInt(req.params.vehicleid);

    console.log("Vehicle: ", vehicleid);

    const result = await client.query(getVehicleByIdQuery, [vehicleid]);
    console.log(result.rows);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicle retrieved, ID:", result.rows[0].vehicleid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    throw error;
  }
};

const addVehicle = async (req, res) => {
  const {
    make,
    model,
    year,
    category,
    color,
    seats,
    mileage,
    availability,
    isInMaintenance,
    priceperday,
    platenumber,
    features,
  } = req.body;

  try {
    const result = await client.query(addVehicleQuery, [
      make,
      model,
      year,
      category,
      color,
      seats,
      mileage,
      availability,
      isInMaintenance,
      priceperday,
      platenumber,
      features,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicle added, ID:", result.rows[0].vehicleid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error adding vehicle:", error.message);
    throw error;
  }
};

const updateVehicleActive = async (req, res) => {
  const { vehicleid, isactive, availability } = req.body;

  try {
    const result = await client.query(updateVehicleActiveQuery, [
      isactive,
      availability,
      vehicleid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicle deleted, ID:", result.rows[0].vehicleid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error deleting vehicle:", error.message);
    throw error;
  }
};

const updateVehicle = async (req, res) => {
  const {
    make,
    model,
    year,
    category,
    color,
    seats,
    mileage,
    availability,
    isinmaintenance,
    vehicleid,
    priceperday,
    platenumber,
    features,
  } = req.body;

  try {
    const result = await client.query(updateVehicleQuery, [
      make,
      model,
      year,
      category,
      color,
      seats,
      mileage,
      priceperday,
      platenumber,
      availability,
      isinmaintenance,
      features,
      vehicleid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicle updated, ID:", result.rows[0].vehicleid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    throw error;
  }
};

const countActiveVehicles = async (req, res) => {
  try {
    const result = await client.query(countActiveVehiclesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Available vehicles counted, Number:", result.rows);
    res.send(result.rows);
  } catch (error) {
    console.error("Error counting available vehicles:", error.message);
    throw error;
  }
};

const countMaintainedVehicles = async (req, res) => {
  try {
    const result = await client.query(countMaintainedVehiclesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Maintained vehicles counted, Number:", result.rows);
    res.send(result.rows);
  } catch (error) {
    console.error("Error counting vehicles in maintenance:", error.message);
    throw error;
  }
};

const getFilters = async (req, res) => {
  try {
    const result = await client.query(getFiltersQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Filters retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving filters:", error.message);
    throw error;
  }
};

const countRentedVehicles = async (req, res) => {
  try {
    const result = await client.query(countRentedVehiclesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Rented vehicles counted, Number:", result.rows);
    res.send(result.rows);
  } catch (error) {
    console.error("Error counting rented vehicle:", error.message);
    throw error;
  }
};

const vehicleSearch = async (req, res) => {
  try {
    let query = baseVehicleSearchQuery;

    const { make, model, category, features } = req.body;

    const values = [];
    const conditions = [];

    if (make) {
      values.push(`%${make}%`);
      conditions.push(`v.make ILIKE $${values.length}`); // case-insensitive partial match
    }
    if (model) {
      values.push(`%${model}%`);
      conditions.push(`v.model ILIKE $${values.length}`);
    }
    if (category) {
      values.push(category);
      conditions.push(`v.category = $${values.length}`);
    }

    if (features && features.length > 0) {
      // Filter vehicles having ALL of the requested features
      // Using GROUP BY and HAVING COUNT to ensure all features matched

      // Add features to values
      //features.forEach(feature => values.push(feature));
      values.push(features);

      query += `
      AND v.vehicleid IN (
        SELECT vf.VehicleID
        FROM VehicleFeatures vf
        JOIN Features f ON vf.FeatureID = f.FeatureID
        WHERE f.FeatureName = ANY($${values.length}::text[])
        GROUP BY vf.VehicleID
      )
    `;

      // features array for ANY clause is the last added value
      // and features.length is used for HAVING count
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
      1;
    }

    const result = await client.query(query, values);

    console.log("Vehicles retrievd successfully:", result.rows);
    res.send(result.rows);
  } catch (error) {
    console.error("Error retreiving vehicles:", error.message);
    throw error;
  }
};

export {
  addVehicle,
  updateVehicleActive,
  updateVehicle,
  getAvailableActiveVehicles,
  getVehicleById,
  countActiveVehicles,
  countMaintainedVehicles,
  vehicleSearch,
  checkoutOfMaintenance,
  getVehiclesInMaintenance,
  countRentedVehicles,
  getAllVehicles,
  getMostRentedVehicles,
  getPopularCategories,
  countTotalVehicleByCategory,
  getFilters,
};

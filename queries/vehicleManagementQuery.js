const addVehicleQuery = `
  INSERT INTO vehicles (
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
    features
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12)
  RETURNING vehicleid;
`;

const updateVehicleActiveQuery = `
  UPDATE Vehicles
  SET isactive = $1, availability = $2
  WHERE vehicleid = $3
  RETURNING vehicleid;
`;

const updateVehicleQuery = `
  UPDATE Vehicles SET
    make = $1,
    model = $2,
    year = $3,
    category = $4,
    color = $5,
    seats = $6,
    mileage = $7,
    priceperday=$8,
    platenumber=$9,
    availability = $10,
    isInMaintenance = $11,
    features = $12
  WHERE vehicleid = $13
  RETURNING vehicleid;
`;

const getMostRentedVehiclesQuery = `SELECT 
  v.vehicleid,
  v.make || ' ' || v.model as vehicle,
  COUNT(b.BookingID) AS totalrentals
FROM vehicles v
JOIN Bookings b ON v.vehicleid = b.vehicleid
GROUP BY v.vehicleid, v.make, v.model
HAVING COUNT(b.BookingID) >= 8
ORDER BY TotalRentals DESC;`;

const getPopularCategoriesQuery = `SELECT 
  v.category as name,
  COUNT(b.BookingID) AS value
FROM vehicles v
JOIN Bookings b ON v.vehicleid = b.vehicleid
GROUP BY v.category
HAVING COUNT(b.BookingID) >= 8
ORDER BY value DESC;`;

const getAvailableActiveVehiclesQuery = `
  SELECT * FROM Vehicles 
  WHERE availability = TRUE AND isinmaintenance = FALSE AND isactive = TRUE;
`;

const getAllVehiclesQuery = `
  SELECT * FROM Vehicles;
`;

const getVehiclesInMaintenanceQuery = `SELECT * FROM vehicles v JOIN DamageReports dr
ON v.vehicleid = dr.vehicleid JOIN damagetypes dt
ON dr.damagetypeid = dt.damagetypeid
WHERE v.isinmaintenance = TRUE AND v.isactive = TRUE`;

const checkoutOfMaintenanceQuery = `UPDATE vehicles 
SET availability = TRUE, isinmaintenance = FALSE 
WHERE vehicleid = $1
RETURNING vehicleid`;

const getVehicleByIdQuery = `
  SELECT * FROM Vehicles
  WHERE vehicleid = $1;
`;

const countActiveVehiclesQuery = `
SELECT COUNT(*) AS active_vehicles, category
FROM Vehicles
WHERE Availability = TRUE AND isActive = TRUE
GROUP BY category
`;

const countTotalVehicleByCategoryQuery = `SELECT COUNT(*) AS cat_total, category, ROW_NUMBER() OVER (ORDER BY category) AS categoryid
FROM Vehicles
WHERE Availability = TRUE AND isActive = TRUE
GROUP BY category`;

const countMaintainedVehiclesQuery = `
SELECT COUNT(*) AS InMaintenance_vehicles, category
FROM Vehicles
WHERE isInMaintenance = TRUE AND isActive = TRUE
GROUP BY category
`;

const countRentedVehiclesQuery = `SELECT COUNT(DISTINCT v.*) AS rented_vehicles,v.category
FROM vehicles v
JOIN bookings b ON b.vehicleid = v.vehicleid
WHERE b.status IN ('Active','Overdue') AND b.actualreturndate IS NULL AND v.isactive = TRUE
GROUP BY v.category
`;

const baseVehicleSearchQuery = `
    SELECT DISTINCT v.*
    FROM Vehicles v
    LEFT JOIN VehicleFeatures vf ON v.VehicleID = vf.VehicleID
    LEFT JOIN Features f ON vf.FeatureID = f.FeatureID
    WHERE v.Availability = TRUE
      AND v.isActive = TRUE
  `;

const getFiltersQuery = `SELECT 
    ARRAY_AGG(DISTINCT make) AS makes,
    ARRAY_AGG(DISTINCT model) AS models,
    ARRAY_AGG(DISTINCT year) AS years,
    ARRAY_AGG(DISTINCT category) AS categories,
    ARRAY_AGG(DISTINCT features) AS features
FROM vehicles;`;

export {
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
};

const reserveVehicleQuery = `
    INSERT INTO Bookings (
      customerID,
      vehicleID,
      pickupdate,
      dropoffdate,
      status,
      pickuplocation,
      dropofflocation
    )
    VALUES ($1, $2, $3, $4, 'Pending', $5, $6)
    RETURNING bookingid;
  `;

const updateBookingQuery = `
UPDATE bookings
SET pickuplocation = $1,
    dropofflocation = $2,
    pickupdate = $3,
    dropoffdate = $4
WHERE bookingid = $5
RETURNING bookingid;
`;

const checkAvailabityQuery = `SELECT v.vehicleid FROM Vehicles v
WHERE v.vehicleID = $1
  AND v.availability = true
  AND NOT EXISTS (
    SELECT 1 FROM Bookings b
    WHERE b.VehicleID = v.VehicleID
      AND b.Status IN ('Pending', 'Overdue','Active')
      AND (
        (b.pickupdate <= $2 AND b.dropoffdate >= $3) -- Overlapping dates
      )
)`;

const checkoutVehicleQuery = `UPDATE Bookings
SET 
  Status = 'Active', handledbystaffid = $1
WHERE bookingid = $2
RETURNING bookingid;
`;

const updateBoookingOnCheckinQuery = `UPDATE Bookings
SET 
  ActualReturnDate = $1,
  Status = 'Completed',
  checkedinbystaffid = $2
WHERE bookingid = $3
RETURNING vehicleid, pickupdate,dropoffdate
;`;

const generateInvoiceQuery = `  INSERT INTO Invoices (
    BookingID,
    Amount,
    LateFees,
    Damages,
    PaymentStatus,
    GeneratedDate
  ) VALUES (
    $1,
    $2,
    $3,
    $4,
    'Unpaid',
    NOW()
  )
RETURNING invoiceid;`;

const getAllInvoicesQuery = `SELECT i.*,c.fullname,c.email,c.phonenumber,v.make,v.model
FROM invoices i
JOIN bookings b ON b.bookingid = i.bookingid
JOIN customers c ON c.customerid = b.customerid
JOIN vehicles v ON v.vehicleid = b.vehicleid`;

const getInvoiceByIdQuery = `SELECT i.*,c.*,v.*
FROM invoices i
JOIN bookings b ON b.bookingid = i.bookingid
JOIN customers c ON c.customerid = b.customerid
JOIN vehicles v ON v.vehicleid = b.vehicleid
WHERE i.invoiceid = $1`;

const getInvoicesByCustomerIdQuery = `SELECT i.*,c.customerid,c.fullname,c.address
FROM invoices i
JOIN bookings b ON b.bookingid = i.bookingid
JOIN customers c ON c.customerid = b.customerid
WHERE c.customerid = $1`;

const getDamagesQuery = `SELECT * from DamageTypes ORDER BY damagetypeid ASC`;

const generateDamageReportsQuery = `INSERT INTO DamageReports (
    bookingid,
    vehicleid,
    damagetypeid,
    additionalnotes,
    charge,
    reportedbystaffid,
    ReportDate
  ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    NOW()
);`;

const updateInvoiceDamageCharge = `
UPDATE Invoices
  SET damages = damages + $1
WHERE invoiceid = $2;`;

const payInvoiceQuery = `UPDATE invoices 
SET paymentstatus = 'Paid'
WHERE invoiceid = $1
RETURNING invoiceid,amount,damages,latefees`;

const generateReceiptQuery = `
  INSERT INTO receipts (invoiceid, amountpaid)
  VALUES ($1, $2)
  RETURNING receiptid;
`;

const getReceiptByInvoiceIdQuery = `
SELECT * FROM receipts
WHERE invoiceid = $1
`;

const checkInvoiceExistQuery = `SELECT invoiceid FROM Invoices WHERE bookingid = $1;`;

const checkVehicleInMaintenanceQuery = `UPDATE Vehicles
  SET availability = FALSE,
  isinmaintenance = TRUE
WHERE vehicleid = $1;`;

const getCurrentBookingsQuery = `SELECT 
  b.bookingid,
  b.vehicleid,
  v.make,
  v.model,
  v.year,
  v.category,
  v.color,
  v.seats,
  v.mileage,
  v.vehicleimagemobile,
  b.pickupdate,
  b.dropoffdate,
  b.pickuplocation,
  b.dropofflocation,
  b.status
FROM Bookings b
JOIN Vehicles v ON b.vehicleid = v.vehicleid
WHERE b.customerid = $1
  AND b.status IN('Active','Pending')
ORDER BY bookingid DESC;`;

const getRentalHistoryQuery = `SELECT 
  b.bookingid,
  b.vehicleid,
  v.make,
  v.model,
  v.year,
  v.category,
  v.color,
  v.seats,
  v.mileage,
  v.vehicleimagemobile,
  b.actualreturndate,
  b.pickupdate,
  b.dropoffdate,
  b.pickuplocation,
  b.dropofflocation,
  b.status,
  i.invoiceid,
  i.paymentstatus
FROM Bookings b
JOIN Vehicles v ON b.vehicleid = v.vehicleid
LEFT JOIN Invoices i ON i.bookingid = b.bookingid
WHERE b.customerid = $1
  AND b.status IN('Completed','Cancel','Overdue')
ORDER BY bookingid DESC;`;

const getAllBookingsQuery = `SELECT  v.*,b.*,c.*
FROM Bookings b
JOIN Vehicles v ON b.vehicleid = v.vehicleid 
JOIN customers c ON b.customerid = c.customerid
ORDER BY bookingid DESC
`;

const getBookingDetailsQuery = `SELECT  v.*,b.*,c.*
FROM Bookings b
JOIN Vehicles v ON b.vehicleid = v.vehicleid 
JOIN customers c ON b.customerid = c.customerid
WHERE bookingid = $1`;

const rescheduleBookingQuery = `
UPDATE Bookings
SET 
  PickUpDate = $1,
  DropOffDate = $2,
  PickUpLocation = $3,
  DropOffLocation = $4
WHERE BookingID = $5
  AND Status = 'Pending'
RETURNING bookingid;
`;

const getOverdueReturnsQuery = `SELECT 
    b.bookingid,
    c.fullname,
    v.make || ' ' || v.model AS vehicle,
    b.pickupdate,
    b.dropoffdate,
    b.actualreturndate,
    CASE 
        WHEN b.actualreturndate > b.dropoffdate AND status = 'Overdue'
        THEN 'Overdue'
        WHEN status = 'Completed'
        THEN 'On Time'
		WHEN status = 'Cancel'
        THEN 'Cancelled'
        ELSE 'Other'
    END AS return_status
FROM bookings b
JOIN customers c ON b.customerid = c.customerid
JOIN vehicles v ON b.vehicleid = v.vehicleid;`;

const getRentalByMonthsQuery = `SELECT 
    TO_CHAR(pickupdate, 'YYYY-MM') AS month,
    COUNT(*) AS rentals
FROM bookings
GROUP BY TO_CHAR(pickupdate, 'YYYY-MM')
ORDER BY month;`;

const getBookingByCustomerIDQuery = `SELECT bookingid, status, pickupdate, dropoffdate, actualreturndate,hasbeennotified
FROM bookings
WHERE customerid = $1
ORDER BY bookingid DESC
LIMIT 1;`;

const updateHasBeenNotifiedBookingQuery = `UPDATE bookings
set hasBeenNotified = true
WHERE bookingid = $1
RETURNING bookingid`;

const cancelBookingQuery = `UPDATE bookings
set Status = $1
WHERE bookingid = $2
RETURNING bookingid`;

const getBookedDatesByVehicleIdQuery = `
SELECT pickupdate, dropoffdate
FROM Bookings
WHERE VehicleID = $1
AND status IN ('Pending', 'Active');
`;

const getRevenuePerYearQuery = `
SELECT 
  SUM(COALESCE(i.amount,0) + COALESCE(i.latefees, 0) + COALESCE(i.damages, 0)) AS revenue,
  EXTRACT(YEAR FROM b.pickupdate) as year
FROM invoices i
JOIN bookings b ON i.bookingid = b.bookingid
WHERE i.paymentstatus = 'Paid' 
GROUP BY year
ORDER BY year
`;

const getBookingsPerYearQuery = `
SELECT 
  EXTRACT(YEAR FROM b.pickupdate) AS year,
  COUNT(b.bookingid) AS value
FROM bookings b
GROUP BY year
ORDER BY year;
`;

const getCostPerYearQuery = `
SELECT 
  SUM(COALESCE(dr.charge,0)) AS cost,
  EXTRACT(YEAR FROM b.pickupdate) as year
FROM damagereports dr
JOIN bookings b ON dr.bookingid = b.bookingid
GROUP BY year
ORDER BY year
`;

const getRevenueByMonthQuery = `
SELECT 
  SUM(COALESCE(i.amount,0) + COALESCE(i.latefees, 0) + COALESCE(i.damages, 0)) AS revenue,
  TO_CHAR(b.pickupdate, 'YYYY-MM') AS date
FROM invoices i
JOIN bookings b ON i.bookingid = b.bookingid
WHERE i.paymentstatus = 'Paid' 
GROUP BY date
ORDER BY date
`;

export {
  reserveVehicleQuery,
  checkAvailabityQuery,
  checkoutVehicleQuery,
  getBookingDetailsQuery,
  checkInvoiceExistQuery,
  getRentalHistoryQuery,
  updateInvoiceDamageCharge,
  generateDamageReportsQuery,
  updateBoookingOnCheckinQuery,
  generateInvoiceQuery,
  checkVehicleInMaintenanceQuery,
  getCurrentBookingsQuery,
  rescheduleBookingQuery,
  getAllBookingsQuery,
  getDamagesQuery,
  getInvoicesByCustomerIdQuery,
  getAllInvoicesQuery,
  getInvoiceByIdQuery,
  payInvoiceQuery,
  updateBookingQuery,
  getOverdueReturnsQuery,
  getRentalByMonthsQuery,
  getBookingByCustomerIDQuery,
  updateHasBeenNotifiedBookingQuery,
  cancelBookingQuery,
  getBookedDatesByVehicleIdQuery,
  getRevenuePerYearQuery,
  getBookingsPerYearQuery,
  getCostPerYearQuery,
  getRevenueByMonthQuery,
  generateReceiptQuery,
  getReceiptByInvoiceIdQuery,
};

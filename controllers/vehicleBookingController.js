import client from "../Database/db.js";
import {
  reserveVehicleQuery,
  checkAvailabityQuery,
  checkoutVehicleQuery,
  updateInvoiceDamageCharge,
  generateDamageReportsQuery,
  updateBoookingOnCheckinQuery,
  getRentalHistoryQuery,
  getCurrentBookingsQuery,
  generateInvoiceQuery,
  checkInvoiceExistQuery,
  checkVehicleInMaintenanceQuery,
  rescheduleBookingQuery,
  getBookingDetailsQuery,
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
} from "../queries/vehicleBookingQuery.js";
import validator from "validator";
import { formatedDate, validateDamageReports } from "../common/utils/utils.js";
import dayjs from "dayjs";

const getInvoicesByCustomerId = async (req, res) => {
  try {
    const customerid = parseInt(req.params.customerid);

    const result = await client.query(getInvoicesByCustomerIdQuery, [
      customerid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Invoices retrieved for customer: ", customerid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving invoice for customer", error);
    throw error;
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoiceid = parseInt(req.params.invoiceid);

    const result = await client.query(getInvoiceByIdQuery, [invoiceid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Invoice retrieved :", invoiceid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving invoice: ", error);
    throw error;
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const result = await client.query(getAllInvoicesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("All Invoices retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving invoices: ", error);
    throw error;
  }
};

const reserveVehicle = async (req, res) => {
  try {
    const {
      customerid,
      vehicleid,
      pickupdate,
      dropoffdate,
      pickuplocation,
      dropofflocation,
    } = req.body;

    if (!validator.isInt(vehicleid.toString())) {
      res.send({ message: "vehicle ID must be an integer" });
      return;
    }

    if (!validator.isInt(customerid.toString())) {
      res.send({ message: "customer ID must be an integer" });
      return;
    }

    // if (!validator.isDate(pickupDate,{ format: 'YYYY-MM-DD', strictMode: true })) {
    // res.send({message: 'pickup date  must be a valid date'});
    // return
    // }

    // if (!validator.isDate(dropoffDate,{ format: 'YYYY-MM-DD', strictMode: true })) {
    // res.send({message: 'dropoff date  must be a valid date'});
    // return
    // }

    if (!pickuplocation || validator.isEmpty(pickuplocation.trim())) {
      res.send({ message: "pickup Location is required" });
      return;
    }

    if (!dropofflocation || validator.isEmpty(dropofflocation.trim())) {
      res.send({ message: "dropoff Location is required" });
      return;
    }

    // 1. check availability status of the car
    const availableVehicle = await client.query(checkAvailabityQuery, [
      vehicleid,
      dropoffdate,
      pickupdate,
    ]);

    if (availableVehicle.rowCount === 0) {
      res.send({ message: "Unavailable" });
      return;
    }

    //  // 2. make booking
    const result = await client.query(reserveVehicleQuery, [
      customerid,
      vehicleid,
      pickupdate,
      dropoffdate,
      pickuplocation,
      dropofflocation,
    ]);

    if (result.rowCount === 0) {
      res.send({ message: "BookingError" });
      return;
    }

    console.log("Booking completed, BookingID: ", result.rows[0].bookingid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error during booking:", error);
    throw error;
  }
};

const updateBooking = async (req, res) => {
  try {
    const {
      vehicleid,
      pickupdate,
      dropoffdate,
      pickuplocation,
      dropofflocation,
      bookingid,
    } = req.body;

    // if (!validator.isDate(pickupDate,{ format: 'YYYY-MM-DD', strictMode: true })) {
    // res.send({message: 'pickup date  must be a valid date'});
    // return
    // }

    // if (!validator.isDate(dropoffDate,{ format: 'YYYY-MM-DD', strictMode: true })) {
    // res.send({message: 'dropoff date  must be a valid date'});
    // return
    // }

    if (!pickuplocation || validator.isEmpty(pickuplocation.trim())) {
      res.send({ message: "pickup Location is required" });
      return;
    }

    if (!dropofflocation || validator.isEmpty(dropofflocation.trim())) {
      res.send({ message: "dropoff Location is required" });
      return;
    }

    // // 1. check availability status of the car
    // const availableVehicle = await client.query(checkAvailabityQuery, [
    //   vehicleid,
    //   dropoffdate,
    //   pickupdate,
    // ]);

    // if (availableVehicle.rowCount === 0) {
    //   res.send({ message: "Unavailable" });
    //   return;
    // }

    //  // 2. make booking
    const result = await client.query(updateBookingQuery, [
      pickuplocation,
      dropofflocation,
      pickupdate,
      dropoffdate,
      bookingid,
    ]);

    if (result.rowCount === 0) {
      res.send({ message: "UpdateError" });
      return;
    }

    console.log("Updated boooking, BookingID: ", result.rows[0].bookingid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error during update of booking:", error);
    throw error;
  }
};

const checkoutVehicle = async (req, res) => {
  try {
    const { bookingid, handledbystaffid } = req.body;

    if (!validator.isInt(bookingid.toString())) {
      res.send({ message: "booking ID must be an integer" });
      return;
    }

    // 1. update booking
    const result = await client.query(checkoutVehicleQuery, [
      handledbystaffid,
      bookingid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Vehicle checked out, BookingID: ", result.rows[0].bookingid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error checking vehicle out:", error);
    throw error;
  }
};

const checkinVehicle = async (req, res) => {
  const lateFeePerDay = 50.0;

  try {
    let { bookingid, priceperday, damageReports, checkedinbystaffid } =
      req.body;

    if (!validator.isInt(bookingid.toString())) {
      res.send({ message: "booking ID must be an integer" });
      return;
    }

    if (!validator.isInt(priceperday.toString())) {
      res.send({ message: "price per day must be an integer" });
      return;
    }

    if (validateDamageReports(damageReports) != true) {
      res.send(validateDamageReports(damageReports));
      return;
    }

    //1.get actual return date
    const actualReturnDate = formatedDate(new Date());

    // 2. checkin vehicle
    await client.query("BEGIN");

    //update booking as checked in
    const bookingResult = await client.query(updateBoookingOnCheckinQuery, [
      actualReturnDate,
      checkedinbystaffid,
      bookingid,
    ]);

    if (bookingResult.rows.length === 0) {
      res.send("Booking not found");
      return;
    }

    const { vehicleid, pickupdate, dropoffdate } = bookingResult.rows[0];

    //update vehicle availabilty
    if (damageReports.length > 0) {
      await client.query(checkVehicleInMaintenanceQuery, [vehicleid]);
      console.log("Vehicle checked in maintenance :", vehicleid);
    }

    const startDay = new Date(pickupdate).setHours(0, 0, 0, 0);
    const endDay = new Date(dropoffdate).setHours(0, 0, 0, 0);
    const actualEndDay = new Date(actualReturnDate).setHours(0, 0, 0, 0);

    let lateDays = 0;
    let rentalDays = 0;
    if (dayjs(actualEndDay).isSame(dayjs(endDay))) {
      //calculate rental days using dropoffdate
      rentalDays = Math.max(
        1,
        Math.ceil(
          (new Date(endDay) - new Date(startDay)) / (1000 * 60 * 60 * 24)
        ) + 1
      );
    } else if (dayjs(actualEndDay).isBefore(dayjs(endDay))) {
      //calculate rental days using actualReturnDate
      rentalDays = Math.max(
        1,
        Math.ceil(
          (new Date(endDay) - new Date(startDay)) / (1000 * 60 * 60 * 24)
        ) + 1
      );
    } else {
      //calculate rental days
      rentalDays = Math.max(
        1,
        Math.ceil(
          (new Date(endDay) - new Date(startDay)) / (1000 * 60 * 60 * 24)
        ) + 1
      );

      //calculate late days
      lateDays = Math.max(
        1,
        Math.ceil(
          (new Date(actualEndDay) - new Date(endDay)) / (1000 * 60 * 60 * 24)
        )
      );
    }

    //check if invoice exist
    const invoiceCheck = await client.query(checkInvoiceExistQuery, [
      bookingid,
    ]);

    if (invoiceCheck.rows.length > 0) {
      res.send({ message: "Invoice already exists" });
      return;
    }

    //generate invoice
    const invoiceResult = await client.query(generateInvoiceQuery, [
      bookingid,
      priceperday * rentalDays,
      lateFeePerDay * lateDays,
      0,
    ]);

    console.log("rental days ", rentalDays);
    console.log("amount ", rentalDays * priceperday);
    console.log("price per day ", priceperday);
    console.log("late days ", lateDays);
    console.log("lat fees ", lateFeePerDay * lateDays);

    const invoiceid = invoiceResult.rows[0].invoiceid;

    //Insert damages if any
    console.log("Damages: ", damageReports);
    for (const damage of damageReports) {
      await client.query(generateDamageReportsQuery, [
        bookingid,
        vehicleid,
        damage.damagetypeid,
        damage.note || null,
        damage.standardcost,
        checkedinbystaffid,
      ]);

      //update the damage by adding damage charge to damage in invoice
      await client.query(updateInvoiceDamageCharge, [
        damage.standardcost,
        invoiceid,
      ]);
    }

    await client.query("COMMIT");

    console.log("Vehicle checked in, VehicleID: ", vehicleid);
    console.log("Invoice generated , InvoiveID: ", invoiceid);
    res.send({ vehicleid: vehicleid, invoiceid: invoiceid });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error checking vehicle in:", error);
    throw error;
  }
};

const getDamages = async (req, res) => {
  try {
    const result = await client.query(getDamagesQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Damages retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving damages: ", error);
    throw error;
  }
};

const getRentalHistory = async (req, res) => {
  const customerid = parseInt(req.params.customerid);

  try {
    if (!validator.isInt(customerid.toString())) {
      res.send({ message: "customer ID must be an integer" });
      return;
    }

    const result = await client.query(getRentalHistoryQuery, [customerid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Rental history retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving rental history: ", error);
    throw error;
  }
};

const getCurrentBookings = async (req, res) => {
  const customerid = parseInt(req.params.customerid);

  try {
    if (!validator.isInt(customerid.toString())) {
      res.send({ message: "customer ID must be an integer" });
      return;
    }

    const result = await client.query(getCurrentBookingsQuery, [customerid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Current bookings retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving current bookings: ", error);
    throw error;
  }
};

const getBookingDetails = async (req, res) => {
  const bookingid = parseInt(req.params.bookingid);

  try {
    if (!validator.isInt(bookingid.toString())) {
      res.send({ message: "booking ID must be an integer" });
      return;
    }

    const result = await client.query(getBookingDetailsQuery, [bookingid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Booking details retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving booking details: ", error);
    throw error;
  }
};

const getAllBookings = async (req, res) => {
  try {
    const result = await client.query(getAllBookingsQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Bookings retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving bookings: ", error);
    throw error;
  }
};

const getRentalByMonths = async (req, res) => {
  try {
    const result = await client.query(getRentalByMonthsQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Rentals by month retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving rentals by month: ", error);
    throw error;
  }
};

const getOverdueReturns = async (req, res) => {
  try {
    const result = await client.query(getOverdueReturnsQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Overdue returns retrieved successfully");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving overdue returns: ", error);
    throw error;
  }
};

const getBookingByCustomerID = async (req, res) => {
  const { customerid } = req.body;
  try {
    const result = await client.query(getBookingByCustomerIDQuery, [
      customerid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved booking successfully for notification");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving booking: ", error);
    throw error;
  }
};

const rescheduleBooking = async (req, res) => {
  try {
    const {
      pickupdate,
      dropoffdate,
      pickuplocation,
      dropofflocation,
      bookingId,
      vehicleid,
    } = req.body;

    if (!validator.isInt(bookingId.toString())) {
      res.send({ message: "booking ID must be an integer" });
      return;
    }

    if (!validator.isInt(vehicleid.toString())) {
      res.send({ message: "vehicle ID must be an integer" });
      return;
    }

    if (!pickuplocation || validator.isEmpty(pickuplocation.trim())) {
      res.send({ message: "pickup Location is required" });
      return;
    }

    if (!dropofflocation || validator.isEmpty(dropofflocation.trim())) {
      res.send({ message: "dropoff Location is required" });
      return;
    }

    // 1. check availability status of the car
    const availableVehicle = await client.query(checkAvailabityQuery, [
      vehicleid,
      pickupdate,
      dropoffdate,
    ]);

    if (availableVehicle.rowCount === 0) {
      res.send({ message: "This car is not available at the selected dates" });
      return;
    }

    // 2. reschedule booking
    const result = await client.query(rescheduleBookingQuery, [
      pickupdate,
      dropoffdate,
      pickuplocation,
      dropofflocation,
      bookingId,
    ]);

    if (result.rowCount === 0) {
      res.send({ message: "Booking not found or cannot be rescheduled." });
      return;
    }

    console.log("Booking rescheduled, BookingID: ", result.rows[0].bookingid);
    res.send(result.rows[0]); // return updated booking
  } catch (err) {
    console.error("Error rescheduling booking:", err.message);
    throw err;
  }
};

const payInvoice = async (req, res) => {
  const { invoiceid, amount } = req.body;
  try {
    await client.query("BEGIN");
    const result = await client.query(payInvoiceQuery, [invoiceid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    const receiptResult = await client.query(generateReceiptQuery, [
      invoiceid,
      amount,
    ]);

    if (receiptResult.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log(
      `Invoice: ${result.rows[0].invoiceid} paid and receipt generated: ${receiptResult.rows[0].receiptid} `
    );
    res.send(result.rows);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error paying invoice: ", error);
    throw error;
  }
};

const cancelBooking = async (req, res) => {
  const { bookingid } = req.body;
  try {
    const result = await client.query(cancelBookingQuery, [
      "Cancel",
      bookingid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Booking cancelled: ", result.rows[0].bookingid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error cancelling booking: ", error);
    throw error;
  }
};

//updates the hasbeennotified field when the vehicle checkin notification has been received by customer
const updateHasBeenNotifiedBooking = async (req, res) => {
  const { bookingid } = req.body;
  try {
    const result = await client.query(updateHasBeenNotifiedBookingQuery, [
      bookingid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("booking updated hasBeenNotified: ", result.rows[0].bookingid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error updating booking hasBeenNotified: ", error);
    throw error;
  }
};

const getDatesBetween = (startDate, endDate) => {
  let dates = [];
  let current = dayjs(startDate);

  while (current.isBefore(dayjs(endDate)) || current.isSame(dayjs(endDate))) {
    dates.push(current.format("YYYY-MM-DD"));
    current = current.add(1, "day");
  }

  return dates;
};

const getBookedDatesByVehicleId = async (req, res) => {
  const { vehicleid } = req.body;
  try {
    const result = await client.query(getBookedDatesByVehicleIdQuery, [
      vehicleid,
    ]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    let allBookedDates = [];

    result.rows?.map((item) => {
      const datesBetween = getDatesBetween(item.pickupdate, item.dropoffdate);
      allBookedDates = [...new Set([...allBookedDates, ...datesBetween])];
    });

    console.log("Retrieved booked dates for vehicle: ", vehicleid);

    res.send(allBookedDates);
  } catch (error) {
    console.error("Error retrieving booking: ", error);
    throw error;
  }
};

const getRevenuePerYear = async (req, res) => {
  try {
    const result = await client.query(getRevenuePerYearQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved Revenue by year: ");

    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving revenue by year", error);
    throw error;
  }
};

const getBookingsPerYear = async (req, res) => {
  try {
    const result = await client.query(getBookingsPerYearQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved total bookings per year");

    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving total bookings per year: ", error);
    throw error;
  }
};

const getCostPerYear = async (req, res) => {
  try {
    const result = await client.query(getCostPerYearQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved cost per year");

    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving cost per year: ", error);
    throw error;
  }
};

const getRevenueByMonth = async (req, res) => {
  try {
    const result = await client.query(getRevenueByMonthQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved revenue per month");

    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving revenue per month: ", error);
    throw error;
  }
};

const getReceiptByInvoiceId = async (req, res) => {
  try {
    const { invoiceid } = req.body;

    const result = await client.query(getReceiptByInvoiceIdQuery, [invoiceid]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Retrieved receipt for invoice: ", invoiceid);

    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving receipt: ", error);
    throw error;
  }
};

export {
  reserveVehicle,
  checkoutVehicle,
  checkinVehicle,
  getRentalHistory,
  getCurrentBookings,
  rescheduleBooking,
  getBookingDetails,
  getAllBookings,
  getDamages,
  getInvoiceById,
  getInvoicesByCustomerId,
  getAllInvoices,
  payInvoice,
  updateBooking,
  getOverdueReturns,
  getRentalByMonths,
  getBookingByCustomerID,
  updateHasBeenNotifiedBooking,
  cancelBooking,
  getBookedDatesByVehicleId,
  getRevenuePerYear,
  getBookingsPerYear,
  getCostPerYear,
  getRevenueByMonth,
  getReceiptByInvoiceId,
};

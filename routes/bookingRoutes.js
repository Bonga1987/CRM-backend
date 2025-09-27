import express from "express";
import {
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
} from "../controllers/vehicleBookingController.js";
import { payForBooking } from "../controllers/checkoutController.js";

const bookingRouter = express.Router(); //use to create get,post, etc methods

//create post request

bookingRouter.post("/update", updateBooking);
bookingRouter.post("/reserve", reserveVehicle);
bookingRouter.post("/checkout", checkoutVehicle);
bookingRouter.post("/checkin", checkinVehicle);
bookingRouter.post("/reschedule", rescheduleBooking);
bookingRouter.post("/checkNotification", getBookingByCustomerID);
bookingRouter.post(
  "/updateHasBeenNotifiedBooking",
  updateHasBeenNotifiedBooking
);
bookingRouter.get("/rentalHistory/:customerid", getRentalHistory);
bookingRouter.get("/currentBookings/:customerid", getCurrentBookings);
bookingRouter.get("/booking/:bookingid", getBookingDetails);
bookingRouter.get("/", getAllBookings);
bookingRouter.get("/damages", getDamages);
bookingRouter.get("/invoices", getAllInvoices);
bookingRouter.get("/invoices/:invoiceid", getInvoiceById);
bookingRouter.get("/invoices/customer/:customerid", getInvoicesByCustomerId);
bookingRouter.post("/invoices/pay", payForBooking);
bookingRouter.post("/invoices/updateStatus", payInvoice);
bookingRouter.get("/overdueReturns", getOverdueReturns);
bookingRouter.get("/rentalByMonths", getRentalByMonths);

export default bookingRouter;

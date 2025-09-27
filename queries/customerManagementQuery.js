const checkEmailExistQuery = `SELECT * FROM Customers WHERE email = $1`;
const checkStaffEmailExistQuery = `SELECT * FROM Staff WHERE email = $1`;

const registerUserQuery = `
 INSERT INTO Customers (fullname, 
    address, 
    phonenumber, 
    email, 
    driverslicense, 
    password) 
    VALUES ($1, $2, $3, $4, $5,$6)
 RETURNING customerid`;

const registerStaffQuery = `
 INSERT INTO Staff (fullname, 
    role,
    phone, 
    email, 
    password) 
    VALUES ($1, $2, $3, $4, $5)
 RETURNING staffid`;

const getFrequentCustomersQuery = `SELECT 
  c.customerid,
  c.fullname as customer,
  COUNT(b.BookingID) AS rentals
FROM Customers c
JOIN Bookings b ON c.CustomerID = b.CustomerID
GROUP BY c.customerid, c.fullname
HAVING COUNT(b.BookingID) >= 5
ORDER BY rentals DESC;`;

const loginUserQuery = `SELECT * FROM Customers WHERE email = $1`;

const loginStaffQuery = `SELECT * FROM Staff WHERE email = $1`;

const getUserQuery = `SELECT * FROM Customers WHERE customerid = $1`;

const updateProfileQuery = `
  UPDATE Customers SET
    fullname = $1,
    address = $2,
    phonenumber = $3,
    email = $4,
    driverslicense = $5
  WHERE customerid = $6
  RETURNING customerid;
`;

const updateStaffProfileQuery = `
  UPDATE Staff SET
    fullname = $1,
    role = $2,
    phone = $3,
    email = $4,
  WHERE staffid = $5
  RETURNING staffid;
`;

export {
  checkEmailExistQuery,
  registerUserQuery,
  loginUserQuery,
  getUserQuery,
  updateProfileQuery,
  loginStaffQuery,
  registerStaffQuery,
  checkStaffEmailExistQuery,
  updateStaffProfileQuery,
  getFrequentCustomersQuery,
};

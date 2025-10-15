import client from "../Database/db.js";
import {
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
  getOldPasswordQuery,
  updatePasswordQuery,
} from "../queries/customerManagementQuery.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    let {
      fullname,
      address,
      phonenumber,
      email,
      driverslicense,
      password,
      confirmPassword,
      licenseissuedate,
      licenseexpirydate,
      licensecode,
    } = req.body;

    // // 2️ Validation
    // if (
    //   !fullname ||
    //   !address ||
    //   !phonenumber ||
    //   !email ||
    //   !driverslicense ||
    //   !password ||
    //   !confirmPassword
    // ) {
    //   res.send({ message: "All fields are required" });
    //   return;
    // }

    // // 1️ Sanitization
    // fullname = validator.trim(fullname);
    // address = validator.trim(address);
    // phonenumber = validator.trim(phonenumber);
    // email = validator.normalizeEmail(email);
    // driverslicense = validator.trim(driverslicense);
    // //license_expiry = validator.trim(license_expiry);
    // password = validator.trim(password);

    // if (
    //   !validator.isStrongPassword(password, {
    //     minLength: 8,
    //     minNumbers: 1,
    //     minSymbols: 1,
    //   })
    // ) {
    //   res.send({
    //     message:
    //       "Password must be at least 8 characters, include a number and a symbol",
    //   });
    //   return;
    // }

    // if (!validator.isLength(fullname, { min: 2, max: 100 })) {
    //   res.send({ message: "fullname must be between 2 and 100 characters" });
    //   return;
    // }

    // if (!validator.isAlphanumeric(driverslicense)) {
    //   res.send({ message: "License number must be alphanumeric" });
    //   return;
    // }

    // if (!validator.isEmail(email)) {
    //   res.send({ message: "Invalid email address" });
    //   return;
    // }

    // // Passwords match check
    // if (password !== confirmPassword) {
    //   res.send({ message: "Passwords do not match." });
    //   return;
    // }

    // 3️ Check if email already exists
    const existingUser = await client.query(checkEmailExistQuery, [email]);
    if (existingUser.rowCount > 0) {
      res.send({ message: "Exist" });
      return;
    }

    // 4️ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️ Insert into database
    const result = await client.query(registerUserQuery, [
      fullname,
      address,
      phonenumber,
      email,
      driverslicense,
      hashedPassword,
      licenseissuedate,
      licenseexpirydate,
      licensecode,
    ]);

    console.log("User registered, ID:", result.rows[0].customerid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

const registerStaff = async (req, res) => {
  try {
    let { fullname, phone, email, password, role, confirmPassword } = req.body;

    // 2️ Validation
    if (
      !fullname ||
      !phone ||
      !email ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      res.send({ message: "All fields are required" });
      return;
    }

    // 1️ Sanitization
    fullname = validator.trim(fullname);
    phone = validator.trim(phone);
    email = validator.normalizeEmail(email);
    password = validator.trim(password);
    role = validator.trim(role);

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      res.send({
        message:
          "Password must be at least 8 characters, include a number and a symbol",
      });
      return;
    }

    if (!validator.isLength(fullname, { min: 2, max: 100 })) {
      res.send({ message: "fullname must be between 2 and 100 characters" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.send({ message: "Invalid email address" });
      return;
    }

    // Passwords match check
    if (password !== confirmPassword) {
      res.send({ message: "Passwords do not match." });
      return;
    }

    // 3️ Check if email already exists
    const existingUser = await client.query(checkStaffEmailExistQuery, [email]);
    if (existingUser.rowCount > 0) {
      res.send({ message: "Email is already registered" });
      return;
    }

    // 4️ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️ Insert into database
    const result = await client.query(registerStaffQuery, [
      fullname,
      role,
      phone,
      email,
      hashedPassword,
    ]);

    console.log("Staff registered, ID:", result.rows[0].staffid);
    res.send(result.rows);
  } catch (error) {
    console.error("Error registering Staff:", error.message);
    throw error;
  }
};

const updateProfile = async (req, res) => {
  try {
    let {
      fullname,
      address,
      phonenumber,
      email,
      driverslicense,
      customerid,
      licensecode,
      licenseissuedate,
      licenseexpirydate,
    } = req.body;

    // 2️ Validation
    // if (
    //   !fullname ||
    //   !address ||
    //   !phonenumber ||
    //   !email ||
    //   !driverslicense ||
    //   !customerid
    // ) {
    //   res.send({ message: "All fields are required" });
    //   return;
    // }

    // 1️ Sanitization
    // fullname = validator.trim(fullname);
    // address = validator.trim(address);
    // phonenumber = validator.trim(phonenumber);
    // email = validator.normalizeEmail(email);
    // driverslicense = validator.trim(driverslicense);
    // customerid = validator.trim(String(customerid));
    //license_expiry = validator.trim(license_expiry);

    // if (!validator.isLength(fullname, { min: 2, max: 100 })) {
    //   res.send({ message: "fullname must be between 2 and 100 characters" });
    //   return;
    // }

    // if (!validator.isAlphanumeric(driverslicense)) {
    //   res.send({ message: "License number must be alphanumeric" });
    //   return;
    // }

    // if (!validator.isEmail(email)) {
    //   res.send({ message: "Invalid email address" });
    //   return;
    // }

    // 5️ Insert into database
    const result = await client.query(updateProfileQuery, [
      fullname,
      address,
      phonenumber,
      email,
      driverslicense,
      customerid,
      licensecode,
      licenseissuedate,
      licenseexpirydate,
    ]);

    console.log("User profile updated, ID:", result.rows[0].customerid);
    res.send(true);
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw error;
  }
};

const updateStaffProfile = async (req, res) => {
  try {
    let { fullname, address, phonenumber, email, driverslicense, customerid } =
      req.body;

    // 2️ Validation
    if (!fullname || !phone || !email || !role || !staffid) {
      res.send({ message: "All fields are required" });
      return;
    }

    // 1️ Sanitization
    fullname = validator.trim(fullname);
    phone = validator.trim(phone);
    email = validator.normalizeEmail(email);
    role = validator.trim(role);
    staffid = validator.trim(String(staffid));

    if (!validator.isLength(fullname, { min: 2, max: 100 })) {
      res.send({ message: "fullname must be between 2 and 100 characters" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.send({ message: "Invalid email address" });
      return;
    }

    // 5️ Insert into database
    const result = await client.query(updateStaffProfileQuery, [
      fullname,
      role,
      phone,
      email,
      staffid,
    ]);

    console.log("Staff profile updated, ID:", result.rows[0].staffid);
    res.send(true);
  } catch (error) {
    console.error("Error updating staff profile:", error.message);
    throw error;
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 1️ Validate presence of fields
    if (!email || !password) {
      res.send({ message: "Email and password are required" });
      return;
    }

    // 2️ Sanitize & validate email
    email = validator.trim(email);
    if (!validator.isEmail(email)) {
      res.send({ message: "Invalid email format" });
      return;
    }

    // 3️ Query DB for user
    const result = await client.query(loginUserQuery, [email]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    // 4️ Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      res.send(false);
      return;
    } else {
      const user = {
        customerid: result.rows[0].customerid,
        fullname: result.rows[0].fullname,
        address: result.rows[0].address,
        phonenumber: result.rows[0].phonenumber,
        email: result.rows[0].email,
        driverslicense: result.rows[0].driverslicense,
        profileimage: result.rows[0].profileimage,
        usertype: result.rows[0].usertype,
        licenseissuedate: result.rows[0].licenseissuedate,
        licenseexpirydate: result.rows[0].licenseexpirydate,
        licensecode: result.rows[0].licensecode,
      };

      // 5️ Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 6️ Send success response
      res.send({ token, user: user });
      console.log("User logged in :", { token, user: user });
    }
  } catch (error) {
    console.error("Error Loging in user:", error);
    throw error;
  }
};

const loginStaff = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 1️ Validate presence of fields
    if (!email || !password) {
      res.send({ message: "Email and password are required" });
      return;
    }

    // 2️ Sanitize & validate email
    email = validator.trim(email);
    if (!validator.isEmail(email)) {
      res.send({ message: "Invalid email format" });
      return;
    }

    // 3️ Query DB for user
    const result = await client.query(loginStaffQuery, [email]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    // 4️ Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      res.send(false);
      return;
    } else {
      const staff = {
        staffid: result.rows[0].staffid,
        fullname: result.rows[0].fullname,
        role: result.rows[0].role,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        usertype: result.rows[0].usertype,
      };

      // 5️ Generate JWT token
      const token = jwt.sign(
        { id: staff.id, email: staff.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 6️ Send success response
      res.send({ token, staff: staff });
      console.log("Staff logged in :", { token, staff: staff });
    }
  } catch (error) {
    console.error("Error Loging in staff:", error);
    throw error;
  }
};

const getUserById = async (req, res) => {
  const userID = parseInt(req.params.id);

  try {
    const result = await client.query(getUserQuery, [userID]);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("User retrieved, ID:", result.rows[0].customerid);
    res.send(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

const getFrequentCustomers = async (req, res) => {
  try {
    const result = await client.query(getFrequentCustomersQuery);

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    console.log("Frequent customers retrieved");
    res.send(result.rows);
  } catch (error) {
    console.error("Error retrieving frequent customers:", error);
    throw error;
  }
};

const updatePassword = async (req, res) => {
  const { customerid, currentPassword, newPassword } = req.body;

  try {
    const result = await client.query(getOldPasswordQuery, [customerid]);
    if (result.rowCount === 0) {
      res.send({ message: "User not found" });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.send({ message: "Incorrect" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await client.query(updatePasswordQuery, [hashedNewPassword, customerid]);

    res.send({ message: "Success" });
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};

export {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  registerStaff,
  loginStaff,
  updateStaffProfile,
  getFrequentCustomers,
  updatePassword,
};

import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import client from "./Database/db.js";
import vehicleRouter from "./routes/vehicleRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import dataSetRouter from "./routes/dataSetRoute.js";
import { fileURLToPath } from "url";
import "dotenv/config.js";
import fs from "fs";
import https from "https";

//app config
const app = express();
const port = 4000;

const options = {
  key: fs.readFileSync("./certs/localhost.key"),
  cert: fs.readFileSync("./certs/localhost.crt"),
};

//middleware
app.use(express.json());
app.use(cors());

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

//api endpoints
app.use("/api/vehicles", vehicleRouter); //endpoint address
app.use("/api/users", userRouter); //endpoint address
app.use("/api/bookings", bookingRouter); //endpoint address
app.use("/api/dataSets", dataSetRouter); //endpoint address
// Serve static files in /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Upload endpoint for mobile profile pic
app.post(
  "/upload/:customerid",
  upload.single("profileImage"),
  async (req, res) => {
    const { customerid } = req.params;
    if (!req.file) return res.send({ error: "No file uploaded" });
    const url = `http://10.0.2.2:4000/uploads/${req.file.filename}`;
    await client.query(
      "UPDATE customers SET profileImage = $1 WHERE customerid = $2",
      [url, customerid]
    );

    res.send({ url });
  }
);
// Upload endpoint for web(vehicles)
app.post(
  "/upload/vehicle/:vehicleid",
  upload.single("vehicleImage"),
  async (req, res) => {
    const { vehicleid } = req.params;
    if (!req.file) return res.send({ error: "No file uploaded" });
    const weburl = `http://localhost:4000/uploads/${req.file.filename}`;
    const mobileurl = `http://10.0.2.2:4000/uploads/${req.file.filename}`;
    const result = await client.query(
      "UPDATE vehicles SET vehicleimage = $1, vehicleimagemobile = $2 WHERE vehicleid = $3 RETURNING vehicleid",
      [weburl, mobileurl, vehicleid]
    );

    if (result.rowCount === 0) {
      res.send(false);
      return;
    }

    res.send({ weburl });
  }
);

// Test root endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

//run server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on http://localhost:${port}`);
  client.connect();
});

// https.createServer(options, app).listen(port, () => {
//   console.log(`HTTPS Server started on https://localhost:${port}`);
//   client.connect();
// });

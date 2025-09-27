import client from "../Database/db.js";
import { faker } from "@faker-js/faker/locale/en_ZA";
import bcrypt from "bcrypt";

const seedStaff = async (count = 6) => {
  try {
    const passwords = ["Passw0rd!", "Passw0rd@"];
    const roles = ["Manager", "Rental Stuff"];
    const usertypes = [0, 1];
    for (let i = 0; i < count; i++) {
      const hashedPassword = await bcrypt.hash(passwords[i], 10);
      await client.query(
        `INSERT INTO staff (fullname, role, email, phone, password, usertype)
       VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          faker.person.fullName(),
          "Rental Stuff",
          faker.internet.email(),
          faker.phone.number("0## ### ###"),
          hashedPassword,
          1, // 0=Admin, 1=Staff
        ]
      );
    }
    console.log(`${count} staff inserted`);
  } catch (error) {
    console.error(error);
  }
};

const seedCustomers = async (count = 20) => {
  const passwords = [
    "Dd<k<emNa(|(Q",
    "hK<:cs#X^rC",
    "Kg0u^L@-C8GsN\\`",
    "{r9_RlX48,N)f",
    "c-e$0Qt&KD",
    "3)P+RRT;0j3Hcs",
    "85j&^^RD?B8c*",
    "PnP'hj(5BEV",
    "$y!(2z0)VQmNl",
    "j\\R}FEYd(m*ErOJx",
    "*BG:Ni*K1'5<LG{~",
    "h.MQSgw`CncPs",
    "W?;^+]rvU_",
    'SIP2-"qx=_x5hS^',
    "/dUa&~:}YR_`}{3^",
    "wPkxL1>[yY",
    ':)otC"AXR',
    '-jVM5(6"1&',
    "S@2[3PY/WgA-u!",
    "e[0X#NH!n/w6",
  ];

  for (let i = 0; i < count; i++) {
    const hashedPassword = await bcrypt.hash(passwords[i], 10);

    await client.query(
      `INSERT INTO customers (fullname, address, phonenumber, email, driverslicense, password, profileimage, usertype)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        faker.person.fullName(),
        faker.location.streetAddress(),
        faker.phone.number("0## ### ###"),
        faker.internet.email(),
        "ZA" + faker.string.numeric(8), // South African style driver license
        hashedPassword,
        faker.image.avatar(),
        2, // assume 2 = customer
      ]
    );
  }
  console.log(`${count} customers inserted`);
};

const seedFeatures = async () => {
  const features = [
    "GPS",
    "Bluetooth",
    "Air Conditioning",
    "Heated Seats",
    "Backup Camera",
  ];
  for (let f of features) {
    await client.query(`INSERT INTO features (featurename) VALUES ($1)`, [f]);
  }
  console.log(`Features inserted`);
};

const seedDamageTypes = async () => {
  const types = [
    { name: "Scratch", cost: 500 },
    { name: "Broken Window", cost: 1500 },
    { name: "Flat Tire", cost: 800 },
    { name: "Engine Issue", cost: 5000 },
  ];
  for (let t of types) {
    await client.query(
      `INSERT INTO damagetypes (name, standardcost) VALUES ($1,$2)`,
      [t.name, t.cost]
    );
  }
  console.log(`Damage types inserted`);
};

const getRandomFeatures = (features) => {
  // shuffle and take first 3
  const shuffled = [...features].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  return selected.join(", ");
};

const seedVehicles = async (count = 10) => {
  // Define vehicle categories
  const categories = [
    "SUV",
    "Sedan",
    "Hatchback",
    "Van",
    "Convertible",
    "Coupe",
    "Crossover",
  ];

  const vehicleFeatures = [
    "Air Conditioning",
    "Power Steering",
    "Bluetooth Connectivity",
    "USB Charging Port",
    "ABS (Anti-lock Braking System)",
    "Airbags",
    "Central Locking",
    "Reverse Camera",
    "Parking Sensors",
    "Cruise Control",
    "Touchscreen Infotainment System",
    "Electric Windows",
    "Alloy Wheels",
    "Navigation (GPS)",
    "Keyless Entry",
  ];

  const { rows: staff } = await client.query(
    `SELECT staffid FROM staff WHERE role = 'Manager'`
  );
  for (let i = 0; i < count; i++) {
    const staffId = faker.helpers.arrayElement(staff).staffid;
    const res = await client.query(
      `INSERT INTO vehicles 
       (make, model, year, category, color, seats, mileage, availability, isinmaintenance, managedbystaffid, isactive, priceperday, vehicleimage, platenumber, vehicleimagemobile, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING vehicleid`,
      [
        faker.vehicle.manufacturer(),
        faker.vehicle.model(),
        faker.number.int({ min: 2010, max: 2025 }),
        faker.helpers.arrayElement(categories),
        faker.vehicle.color(),
        faker.number.int({ min: 2, max: 5 }),
        faker.number.int({ min: 1000, max: 200000 }),
        true,
        false,
        staffId,
        true,
        faker.number.int({ min: 300, max: 1500 }),
        faker.image.urlPicsumPhotos(),
        faker.string.alphanumeric({ length: 2 }).toUpperCase() +
          " " +
          faker.number.int({ min: 100, max: 999 }) +
          " " +
          faker.string.alpha({ length: 2 }).toUpperCase(), // SA plate style
        faker.image.urlPicsumPhotos(),
        getRandomFeatures(vehicleFeatures),
      ]
    );

    // const vehicleId = res.rows[0].vehicleid;

    // // Assign random features
    // const { rows: features } = await client.query(
    //   `SELECT featureid FROM features`
    // );
    // const chosen = faker.helpers.arrayElements(
    //   features,
    //   faker.number.int({ min: 1, max: 3 })
    // );
    // for (let f of chosen) {
    //   await client.query(
    //     `INSERT INTO vehiclefeatures (vehicleid, featureid) VALUES ($1,$2)`,
    //     [vehicleId, f.featureid]
    //   );
    // }
  }
  console.log(`${count} vehicles inserted with features`);
};

const seedBookings = async (count = 10) => {
  const { rows: customers } = await client.query(
    `SELECT customerid FROM customers`
  );
  const { rows: vehicles } = await client.query(
    `SELECT vehicleid,priceperday FROM vehicles`
  );
  const { rows: staff } = await client.query(`SELECT staffid FROM staff`);
  const locations = ["Downtown", "Station", "University", "Airport"];

  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const vehicle = faker.helpers.arrayElement(vehicles);
    const handledbystaffid = faker.helpers.arrayElement(staff).staffid;
    const checkedinbystaffid = faker.helpers.arrayElement(staff).staffid;
    const pickuplocation = faker.helpers.arrayElement(locations);
    const dropofflocation = faker.helpers.arrayElement(locations);

    const pickupdate = faker.date.between({
      from: "2024-01-01",
      to: "2025-12-31",
    });
    const dropoffdate = faker.date.soon({
      days: faker.number.int({ min: 1, max: 10 }),
      refDate: pickupdate,
    });
    const actualreturndate = faker.date.soon({
      days: faker.number.int({ min: 1, max: 5 }),
      refDate: dropoffdate,
    });
    const status = faker.helpers.arrayElement([
      "Pending",
      "Active",
      "Completed",
      "Overdue",
    ]);

    const res = await client.query(
      `INSERT INTO bookings 
       (customerid, vehicleid, handledbystaffid, checkedinbystaffid, pickupdate, dropoffdate, actualreturndate, pickuplocation, dropofflocation, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING bookingid,status,vehicleid`,
      [
        customer.customerid,
        vehicle.vehicleid,
        status !== "Pending" ? handledbystaffid : null,
        status === "Completed" || status === "Overdue"
          ? checkedinbystaffid
          : null,
        pickupdate,
        dropoffdate,
        status === "Completed"
          ? dropoffdate
          : status === "Overdue"
          ? actualreturndate
          : null,
        pickuplocation,
        dropofflocation,
        status,
      ]
    );

    const bookingId = res.rows[0].bookingid;
    const returnedStatus = res.rows[0].status;
    const returnedVehicleid = res.rows[0].vehicleid;

    if (returnedStatus === "Completed" || returnedStatus === "Overdue") {
      const { rows: dmgTypes } = await client.query(
        `SELECT damagetypeid, standardcost FROM damagetypes`
      );

      //input random actual return date if status is overdue
      // let actualreturndate = null;
      // if (returnedStatus === "Overdue") {
      // }

      let dmg = null;
      // Random damage report
      if (Math.random() < 0.2) {
        dmg = faker.helpers.arrayElement(dmgTypes);
        await client.query(
          `INSERT INTO damagereports (bookingid, vehicleid, damagetypeid, additionalnotes, charge, reportedbystaffid, reportdate)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            bookingId,
            returnedVehicleid,
            dmg.damagetypeid,
            faker.lorem.sentence(),
            dmg.standardcost,
            checkedinbystaffid,
            new Date(),
          ]
        );

        await client.query(
          `UPDATE Vehicles SET availability = FALSE, isinmaintenance = TRUE WHERE vehicleid = $1;`,
          [returnedVehicleid]
        );
      }

      const startDay = new Date(pickupdate).setHours(0, 0, 0, 0);
      const endDay = new Date(dropoffdate).setHours(0, 0, 0, 0);
      const actualEndDay = new Date(actualreturndate).setHours(0, 0, 0, 0);

      //calculate late fee
      const lateFeePerDay = 50.0;
      const lateDays = Math.max(
        1,
        Math.ceil(
          (new Date(actualEndDay) - new Date(endDay)) / (1000 * 60 * 60 * 24)
        )
      );

      const latefee = lateFeePerDay * lateDays;

      //calculte rental amount
      const rentalDays = Math.max(
        1,
        Math.ceil(
          (new Date(endDay) - new Date(startDay)) / (1000 * 60 * 60 * 24)
        ) + 1
      );

      // Invoice
      await client.query(
        `INSERT INTO invoices (bookingid, amount, latefees, damages, paymentstatus, generateddate)
       VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          bookingId,
          vehicle.priceperday * rentalDays,
          status === "Overdue" ? latefee : 0,
          dmg === null ? 0 : dmg.standardcost,
          faker.helpers.arrayElement(["Paid", "Unpaid"]),
          new Date(),
        ]
      );
    }
  }
  console.log(`${count} bookings with invoices and some damages inserted`);
};

const seedMaintenance = async (count = 10) => {
  const { rows: vehicles } = await client.query(
    `SELECT vehicleid FROM vehicles`
  );
  for (let i = 0; i < count; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    await client.query(
      `INSERT INTO maintenance (vehicleid, date, description, performedby) VALUES ($1,$2,$3,$4)`,
      [
        vehicle.vehicleid,
        faker.date.past(),
        faker.lorem.sentence(),
        faker.person.fullName(),
      ]
    );
  }
  console.log(`${count} maintenance records inserted`);
};

const main = async (re, res) => {
  try {
    // await seedStaff();
    // await seedCustomers();
    // await seedDamageTypes();
    // await seedVehicles();
    await seedBookings();
    // await seedFeatures();
    // await seedMaintenance(10);

    console.log("Seeding complete!");
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.send({ success: false });
  }
};

export { main };

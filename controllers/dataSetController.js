import { faker } from "@faker-js/faker/locale/en_ZA";
import client from "../Database/db.js";

const dataSetBooking = async (req, res) => {
  const pickup = faker.date.between({ from: "2024-01-01", to: "2024-12-31" });
  const dropoff = faker.date.soon({
    days: faker.number.int({ min: 2, max: 10 }),
    refDate: pickup,
  });

  const generateBooking = () => {
    return {
      customerName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number("0## ### ###"), // ZA mobile format
      vehicle: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      licensePlate:
        faker.string.alphanumeric({ length: 2 }).toUpperCase() +
        " " +
        faker.number.int({ min: 100, max: 999 }) +
        " " +
        faker.string.alpha({ length: 2 }).toUpperCase(), // SA plate style
      pickUpDate: pickup,
      dropOffDate: dropoff,
      pricePerDay: faker.number.int({ min: 500, max: 1500 }), // realistic ZA rental rate
      location: faker.location.city(), // Johannesburg, Cape Town, Durban, etc.
      driversLicense: "ZA" + faker.string.numeric(8), // South African style driver license
    };
  };

  res.send(generateBooking());
  console.log(generateBooking());
};

export { dataSetBooking };

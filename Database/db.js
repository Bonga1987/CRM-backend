import pkg from 'pg';
import dotenv from "dotenv";


// db connection
dotenv.config()
const {Client} = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


export default client;
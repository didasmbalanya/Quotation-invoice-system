import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// Fallback to default .env if specific file is not found
dotenv.config();


const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: env === "test" ? false : console.log,
  }
);

export default sequelize;

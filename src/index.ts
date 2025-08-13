import "dotenv/config";

import app from "./app";
import sequelize from "./db/index";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log(">>>>>>>>>>>>>>>>>>", process.env.NODE_ENV);
    console.log(`Connecting to database: ${process.env.DB_NAME}`);
    await sequelize.authenticate();
    console.log(`Database connection established successfully. using ${process.env.DB_NAME} database.`);
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
    }
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();

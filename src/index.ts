import "dotenv/config";

import app from "./app";
import sequelize from "./db/index";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection established successfully.`);
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

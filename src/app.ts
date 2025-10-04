import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import quotationRoutes from "./routes/quotationRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// create a simple request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/quotations", quotationRoutes);
app.use("/api/invoices", invoiceRoutes);

export default app;

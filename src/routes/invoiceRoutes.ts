import { Router } from "express";
import {
  createInvoiceFromQuotation,
  getInvoicePDF,
  listInvoices,
} from "../controllers/invoiceController";

const router = Router();

router.post("/:id", createInvoiceFromQuotation);
router.get("/:id/pdf", getInvoicePDF);
router.get("/", listInvoices);

export default router;

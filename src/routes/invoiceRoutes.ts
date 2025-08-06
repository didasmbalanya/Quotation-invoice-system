import { Router } from "express";
import {
  createInvoiceFromQuotation,
  getInvoicePDF,
} from "../controllers/invoiceController";

const router = Router();

router.post("/:id", createInvoiceFromQuotation);
router.get("/:id/pdf", getInvoicePDF);

export default router;

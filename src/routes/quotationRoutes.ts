import { Router } from "express";
import {
  createQuotation,
  listQuotations,
  updateQuotation,
  getQuotationPDF,
} from "../controllers/quotationController";

const router = Router();

router.post("/", createQuotation);
router.get("/", listQuotations);
router.patch("/:id", updateQuotation);
router.get("/:id/pdf", getQuotationPDF);

export default router;

import { Router } from "express";
import {
  createQuotation,
  listQuotations,
  updateQuotation,
  getQuotationPDF,
  getQuotationById,
} from "../controllers/quotationController";
import { validateQuotation, validateQuotationUpdate } from "../middlewares";

const router = Router();

router.post("/", validateQuotation, createQuotation);
router.get("/", listQuotations);
router.get("/:id", getQuotationById);
router.patch("/:id", validateQuotationUpdate, updateQuotation);
router.get("/:id/pdf", getQuotationPDF);

export default router;

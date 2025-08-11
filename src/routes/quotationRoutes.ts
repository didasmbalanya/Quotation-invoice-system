import { Router } from "express";
import {
  createQuotation,
  listQuotations,
  updateQuotation,
  getQuotationPDF,
} from "../controllers/quotationController";
import { validateQuotation } from "../middlewares";

const router = Router();

router.post("/", validateQuotation, createQuotation);
router.get("/", listQuotations);
router.patch("/:id",validateQuotation, updateQuotation);
router.get("/:id/pdf", getQuotationPDF);

export default router;

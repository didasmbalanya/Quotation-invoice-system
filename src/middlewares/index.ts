import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { QuotationAttributes } from "../types";

// Define the Joi schema based on QuotationAttributes
const quotationSchema = Joi.object<QuotationAttributes>({
  clientName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  quotationDate: Joi.date().required(),
  items: Joi.string().required(), // If items is JSON, validate after parsing
  totalAmount: Joi.number().required(),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
});

export function validateQuotation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = quotationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }
  next();
}

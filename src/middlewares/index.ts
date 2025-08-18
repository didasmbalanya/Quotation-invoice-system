import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { QuotationAttributes } from "../types";

// Define the Joi schema based on QuotationAttributes
const quotationSchema = Joi.object<QuotationAttributes>({
  clientName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  quotationDate: Joi.date().required(),
  items: Joi.alternatives().try(Joi.string(), Joi.array()).required(),
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

 const updateQuotationSchema = Joi.object<Partial<QuotationAttributes>>({
  clientName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  quotationDate: Joi.date().optional(),
  items: Joi.alternatives().try(Joi.string(), Joi.array()).optional(),
  totalAmount: Joi.number().optional(),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
})
  .min(1) // Require at least one field to be updated
  .messages({
    "object.min": "At least one field must be provided to update the quotation",
  });

export function validateQuotationUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = updateQuotationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }
  next();
}

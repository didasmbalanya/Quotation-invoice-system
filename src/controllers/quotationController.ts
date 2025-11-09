// src/controllers/quotationController.ts
import { Request, Response } from "express";
import { Quotation } from "../models";
import { generateQuotationPDF } from "../services/pdfService";

export const createQuotation = async (req: Request, res: Response) => {
  try {
    // check if we have already saved a quotation with the same uniqueId
    const duplicate = await Quotation.findOne({
      where: { uniqueQuotationId: req.body.uniqueQuotationId },
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ error: "This Quotation has already been created" });
    }

    // calculate total amount from items
    const totalamount = req.body.items.reduce(
      (sum: number, item: any) => sum + item.amount,
      0
    );
    req.body.totalAmount = totalamount;
    const quotation = await Quotation.create(req.body);
    res.status(201).json(quotation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create quotation", message: error });
  }
};

export const listQuotations = async (req: Request, res: Response) => {
  try {
    const quotations = await Quotation.findAll();
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quotations" });
  }
};

export const getQuotationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }
    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quotation" });
  }
};

export const updateQuotation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Quotation.update(req.body, {
      where: { id },
    });

    const updatedQuotation = await Quotation.findByPk(id);

    res.status(200).json({
      message: "Quotation updated successfully",
      updatedQuotation,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update quotation" });
  }
};

export const getQuotationPDF = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }
    const pdfBuffer = await generateQuotationPDF(quotation);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

export const deleteQuotation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await Quotation.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.status(200).json({ message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quotation" });
  }
};

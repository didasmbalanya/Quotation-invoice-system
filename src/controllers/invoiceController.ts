// src/controllers/invoiceController.ts
import { Request, Response } from "express";
import { Invoice, Quotation } from "../models";
import { generateInvoicePDF } from "../services/pdfService";
import { generateInvoiceNumber } from "../utils/helpers";

export const createInvoiceFromQuotation = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    await Quotation.update(
      { status: "approved" },
      { where: { id: quotation.id } }
    );
    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(quotation.id),
      invoiceDate: new Date(),
      quotationId: quotation.id,
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice", message: error });
  }
};

export const getInvoicePDF = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    const quotation = await Quotation.findByPk(invoice.quotationId);
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }
    let pdfBuffer = await generateInvoicePDF(invoice, quotation);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

export const listInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve invoices" });
  }
};

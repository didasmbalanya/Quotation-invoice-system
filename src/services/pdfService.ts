import PDFDocument from "pdfkit";
import { InvoiceAttributes, QuotationAttributes } from "../types";

export const generateQuotationPDF = async (
  quotation: QuotationAttributes
): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.fontSize(20).text("Quotation", { align: "center" });
  doc.text(`Client: ${quotation.clientName}`);
  doc.text(`Email: ${quotation.email}`);
  doc.text(`Phone: ${quotation.phone}`);
  doc.text(`Date: ${quotation.quotationDate}`);
  doc.moveDown();
  doc.text("Items:");

  const items = JSON.parse(quotation.items);
  items.forEach((item: any, i: number) => {
    doc.text(`${i + 1}. ${item.name} x ${item.qty} @ ${item.price}`);
  });

  doc.moveDown();
  doc.text(`Total: ${quotation.totalAmount}`);
  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

export const generateInvoicePDF = async (
  invoice: InvoiceAttributes,
  quotation: QuotationAttributes
): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.text(`Invoice #: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${invoice.invoiceDate}`);
  doc.text(`Client: ${quotation.clientName}`);
  doc.text(`Email: ${quotation.email}`);
  doc.text(`Phone: ${quotation.phone}`);
  doc.moveDown();
  doc.text("Items:");

  const items = JSON.parse(quotation.items);
  items.forEach((item: any, i: number) => {
    doc.text(`${i + 1}. ${item.name} x ${item.qty} @ ${item.price}`);
  });

  doc.moveDown();
  doc.text(`Total: ${quotation.totalAmount}`);
  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

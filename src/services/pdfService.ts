import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { InvoiceAttributes, QuotationAttributes } from "../types";

const secondaryColor = "#a07a3f";
const logoPath = path.join(__dirname, "../assets/logo.png");

function addHeader(doc: typeof PDFDocument, title: string) {
  // Logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 100 });
  }

  // Business Info
  doc
    .fontSize(16)
    .fillColor(secondaryColor)
    .text("CIALA RESORT KISUMU", 200, 50, { align: "right" })
    .fontSize(10)
    .fillColor("black")
    .text("Kisumu", { align: "right" })
    .text("Phone: +254 700 000 000", { align: "right" })
    .text("Email: info@cialaexample.com", { align: "right" });

  doc.moveDown();
  doc.moveTo(50, 110).lineTo(550, 110).strokeColor(secondaryColor).stroke();

  // Title
  doc
    .moveDown()
    .fontSize(20)
    .fillColor(secondaryColor)
    .text(title, { align: "center" });
  doc.moveDown();
}

function addFooter(doc: typeof PDFDocument) {
  doc.moveTo(50, 750).lineTo(550, 750).strokeColor(secondaryColor).stroke();
  doc
    .fontSize(9)
    .fillColor("black")
    .text(
      "Thank you for choosing Ciala Resort Kisumu. For inquiries, contact info@cialaexample.com",
      50,
      760,
      { align: "center" }
    );
}

function addClientDetails(doc: typeof PDFDocument, quotation: QuotationAttributes) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Client: ${quotation.clientName}`)
    .text(`Email: ${quotation.email}`)
    .text(`Phone: ${quotation.phone}`)
    .text(`Date: ${quotation.quotationDate}`);
  doc.moveDown();
}

function addItemsTable(doc: typeof PDFDocument, items: any[], totalAmount: number) {
  const startY = doc.y;
  const tableTop = startY;
  const itemSpacing = 20;
  let rowY = tableTop;

  // Table Header
  doc
    .fontSize(12)
    .fillColor("white")
    .rect(50, rowY, 500, itemSpacing)
    .fill(secondaryColor)
    .fillColor("white")
    .text("Item", 55, rowY + 5)
    .text("Qty", 300, rowY + 5)
    .text("Price", 350, rowY + 5)
    .text("Total", 450, rowY + 5);

  rowY += itemSpacing;

  // Table Rows
  items.forEach((item, i) => {
    const isEven = i % 2 === 0;
    doc
      .fillColor("black")
      .rect(50, rowY, 500, itemSpacing)
      .fill(isEven ? "#f8f8f8" : "white")
      .fillColor("black")
      .text(item.name, 55, rowY + 5)
      .text(item.qty.toString(), 300, rowY + 5)
      .text(item.price.toFixed(2), 350, rowY + 5)
      .text((item.qty * item.price).toFixed(2), 450, rowY + 5);

    rowY += itemSpacing;
  });

  // Total Row
  doc
    .rect(50, rowY, 500, itemSpacing)
    .fill(secondaryColor)
    .fillColor("white")
    .fontSize(12)
    .text("Total", 350, rowY + 5)
    .text(totalAmount.toFixed(2), 450, rowY + 5);

  doc.moveDown();
}

export const generateQuotationPDF = async (
  quotation: QuotationAttributes
): Promise<Buffer> => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  addHeader(doc, "QUOTATION");
  addClientDetails(doc, quotation);
  addItemsTable(doc, JSON.parse(quotation.items), quotation.totalAmount);
  addFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

export const generateInvoicePDF = async (
  invoice: InvoiceAttributes,
  quotation: QuotationAttributes
): Promise<Buffer> => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  addHeader(doc, "INVOICE");
  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Invoice #: ${invoice.invoiceNumber}`)
    .text(`Invoice Date: ${invoice.invoiceDate}`);
  doc.moveDown();

  addClientDetails(doc, quotation);
  addItemsTable(doc, JSON.parse(quotation.items), quotation.totalAmount);
  addFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

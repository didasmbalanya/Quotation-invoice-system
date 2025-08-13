import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { InvoiceAttributes, QuotationAttributes } from "../types";

const secondaryColor = "#a07a3f";
const accentColor = "#f5e7d0";
const tableHeaderBg = "#e6d3b3";
const tableRowEven = "#f8f6f2";
const tableRowOdd = "#fff";
const footerBg = "#a07a3f";
const logoPath = path.join(__dirname, "../assets/logo.png");

function addHeader(doc: typeof PDFDocument, title: string) {
  // Header background
  doc.rect(0, 0, doc.page.width, 120).fill(accentColor);

  // Logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, 35, { width: 80 });
  }

  // Business Info
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(secondaryColor)
    .text("CIALA RESORT KISUMU", 160, 40, { align: "right" })
    .font("Helvetica")
    .fontSize(11)
    .fillColor("black")
    .text("Kisumu", { align: "right" })
    .text("Phone: +254 700 000 000", { align: "right" })
    .text("Email: info@cialaexample.com", { align: "right" });

  // Title
  doc
    .moveDown(2)
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor(secondaryColor)
    .text(title, 0, 110, { align: "center" });

  // Divider
  doc
    .moveTo(50, 145)
    .lineTo(550, 145)
    .strokeColor(secondaryColor)
    .lineWidth(1.5)
    .stroke();
  doc.moveDown(2);
}

function addFooter(doc: typeof PDFDocument) {
  // Footer background
  doc.rect(0, 740, doc.page.width, 40).fill(footerBg);

  doc
    .fontSize(9)
    .fillColor("white")
    .text(
      "Thank you for choosing Ciala Resort Kisumu. For inquiries, contact info@cialaexample.com",
      0,
      752,
      { align: "center", width: doc.page.width }
    );
}

function addClientDetails(
  doc: typeof PDFDocument,
  quotation: QuotationAttributes
) {
  doc
    .moveDown(1)
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(secondaryColor)
    .text("Client Details", 50, doc.y);

  doc
    .moveDown(0.5)
    .font("Helvetica")
    .fontSize(11)
    .fillColor("black")
    .text(`Name: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(quotation.clientName)
    .font("Helvetica")
    .text(`Email: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(quotation.email)
    .font("Helvetica")
    .text(`Phone: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(quotation.phone)
    .font("Helvetica")
    .text(`Date: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(`${quotation.quotationDate}`);

  doc.moveDown(1.5);
}

function addItemsTable(
  doc: typeof PDFDocument,
  items: any[],
  totalAmount: number
) {
  const tableTop = doc.y;
  const itemSpacing = 24;
  let rowY = tableTop;

  // Table Header
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("black")
    .rect(50, rowY, 500, itemSpacing)
    .fill(tableHeaderBg)
    .strokeColor(secondaryColor)
    .lineWidth(1)
    .stroke()
    .fillColor(secondaryColor)
    .text("Item", 60, rowY + 6)
    .text("Qty", 270, rowY + 6, { width: 40, align: "right" })
    .text("Price", 340, rowY + 6, { width: 60, align: "right" })
    .text("Total", 450, rowY + 6, { width: 80, align: "right" });

  rowY += itemSpacing;

  // Table Rows
  items.forEach((item, i) => {
    const bgColor = i % 2 === 0 ? tableRowEven : tableRowOdd;
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("black")
      .rect(50, rowY, 500, itemSpacing)
      .fill(bgColor)
      .strokeColor("#e0e0e0")
      .lineWidth(0.5)
      .stroke()
      .fillColor("black")
      .text(item.name, 60, rowY + 6)
      .text(item.qty.toString(), 270, rowY + 6, { width: 40, align: "right" })
      .text(item.price.toFixed(2), 340, rowY + 6, { width: 60, align: "right" })
      .text((item.qty * item.price).toFixed(2), 450, rowY + 6, {
        width: 80,
        align: "right",
      });

    rowY += itemSpacing;
  });

  // Total Row
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("white")
    .rect(50, rowY, 500, itemSpacing)
    .fill(secondaryColor)
    .strokeColor(secondaryColor)
    .stroke()
    .text("Total", 340, rowY + 6, { width: 60, align: "right" })
    .text(totalAmount.toFixed(2), 450, rowY + 6, { width: 80, align: "right" });

  doc.moveDown(2);
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
    .moveDown(1)
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(secondaryColor)
    .text("Invoice Details", 50, doc.y);

  doc
    .moveDown(0.5)
    .font("Helvetica")
    .fontSize(11)
    .fillColor("black")
    .text(`Invoice #: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(invoice.invoiceNumber)
    .font("Helvetica")
    .text(`Invoice Date: `, 60, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(`${invoice.invoiceDate}`);

  doc.moveDown(1);

  addClientDetails(doc, quotation);
  addItemsTable(doc, JSON.parse(quotation.items), quotation.totalAmount);
  addFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

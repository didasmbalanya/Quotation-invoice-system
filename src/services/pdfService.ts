import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { InvoiceAttributes, QuotationAttributes } from "../types";

const secondaryColor = "#a07a3f";
const logoPath = path.join(__dirname, "../assets/logo.png");

function parseItems(items: any): any[] {
  try {
    if (typeof items === "string") {
      return JSON.parse(items);
    }
    if (Array.isArray(items)) {
      return items;
    }
    return [];
  } catch (e) {
    return [];
  }
}

function addHeader(doc: PDFKit.PDFDocument, title: string) {
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 100 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(secondaryColor)
    .text("CIALA RESORT KISUMU", 200, 50, { align: "right" })
    .fontSize(10)
    .fillColor("black")
    .text("P.O. BOX 7490-40100 KISUMU", { align: "right" })
    .text("Phone: 0705335555 / 0710167449", { align: "right" })
    .text("Email: bdm@cialaressort.com", { align: "right" })
    .text("Website: www.cialaresort.com", { align: "right" });

  doc
    .moveDown(2)
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(secondaryColor)
    .text(title, { align: "center" });

  doc.moveDown(1);
}

function addClientSection(doc: PDFKit.PDFDocument, quotation: QuotationAttributes) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("black")
    .text("TO:", 50, doc.y)
    .font("Helvetica")
    .fontSize(11)
    .text(`${quotation.clientName}`)
    .text(`${quotation.email}`)
    .text(`${quotation.phone}`)
    .moveDown(1);

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(`DATE: ${new Date(quotation.quotationDate).toLocaleDateString()}`, 400, 200)
    .text(`QUOTE #: ${quotation.id || "-"}`, 400)
    .text("Valid Until: 30 Days", 400)
    .moveDown(1);
}

function addItemsTable(doc: PDFKit.PDFDocument, rawItems: any, totalAmount: number) {
  const items = parseItems(rawItems);

  const tableTop = doc.y + 20;
  let y = tableTop;

  // Header
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("black")
    .text("DESCRIPTION", 50, y)
    .text("QTY", 270, y)
    .text("UNIT PRICE", 340, y)
    .text("AMOUNT", 450, y);

  y += 20;

  // Rows
  items.forEach((item) => {
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(item.name, 50, y);

    if (item.subItems && Array.isArray(item.subItems)) {
      item.subItems.forEach((sub: any) => {
        y += 15;
        doc.font("Helvetica-Oblique").fontSize(9).text(`* ${sub}`, 60, y);
      });
    }

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(item.qty?.toString() || "-", 270, y)
      .text(item.price?.toFixed(2) || "0.00", 340, y)
      .text(((item.qty || 0) * (item.price || 0)).toFixed(2), 450, y);

    y += 20;
  });

  // Totals
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("SUBTOTAL", 340, y + 10)
    .text(totalAmount.toFixed(2), 450, y + 10)
    .text("VAT (16%)", 340, y + 30)
    .text((totalAmount * 0.16).toFixed(2), 450, y + 30)
    .text("TOTAL", 340, y + 50)
    .text((totalAmount * 1.16).toFixed(2), 450, y + 50);
}

function addFooter(doc: PDFKit.PDFDocument) {
  doc
    .moveDown(3)
    .font("Helvetica")
    .fontSize(9)
    .text("1. Our credit terms are 30 days after dispatch of the invoice.")
    .text("2. Duly signed LPO or Down payment is required to confirm booking.")
    .text("3. The quotation is inclusive of all taxes.")
    .text("4. Cancellation fee equivalent to 50% applies if within 48hrs.")
    .text("5. No-show fee equivalent to 100% of the quote will be charged.")
    .moveDown(2)
    .text("BANK: KCB")
    .text("ACCOUNT NAME: CIALA RESORT KENYA LIMITED")
    .text("ACCOUNT NO: 123528287")
    .text("BRANCH: KISUMU")
    .text("RTGS IFSC CODE: KCBLKENX");
}

export const generateQuotationPDF = async (
  quotation: QuotationAttributes
): Promise<Buffer> => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  addHeader(doc, "QUOTATION");
  addClientSection(doc, quotation);
  addItemsTable(doc, quotation.items, quotation.totalAmount);
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
  addClientSection(doc, quotation);
  addItemsTable(doc, quotation.items, quotation.totalAmount);
  addFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

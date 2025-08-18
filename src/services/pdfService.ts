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
    doc.image(logoPath, 50, 40, { width: 80 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(secondaryColor)
    .text("CIALA RESORT KISUMU", 150, 45, { align: "right" })
    .font("Helvetica")
    .fontSize(10)
    .fillColor("black")
    .text("P.O. BOX 7490-40100 KISUMU", { align: "right" })
    .text("PHONE: 0705335555 / 0710167449", { align: "right" })
    .text("Email: bdm@cialaresort.com", { align: "right" })
    .text("Website: www.cialaresort.com", { align: "right" });

  doc
    .moveDown(1)
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(secondaryColor)
    .text(title, { align: "center" });

  doc.moveDown(0.5);
}

function addClientSection(
  doc: PDFKit.PDFDocument,
  quotation: QuotationAttributes
) {
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
    .text(
      `DATE: ${new Date(quotation.quotationDate).toLocaleDateString()}`,
      400,
      200
    )
    .text(`QUOTE #: ${quotation.id || "-"}`, 400)
    .text("Valid Until: 30 Days", 400)
    .moveDown(1);
}

function addItemsTable(
  doc: PDFKit.PDFDocument,
  rawItems: any,
  totalAmount: number
) {
  const items = parseItems(rawItems);

  const tableTop = doc.y + 10;
  let y = tableTop;

  // Table Header
  doc.rect(50, y, 500, 20).fill(secondaryColor).stroke(); // changed from 430 to 500

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("white")
    .text("DESCRIPTION", 54, y + 5)
    .text("QTY", 270, y + 5)
    .text("UNIT PRICE", 340, y + 5)
    .text("AMOUNT", 450, y + 5);

  y += 20;

  // Table Rows
  items.forEach((item, idx) => {
    // Optional: alternate row color
    if (idx % 2 === 0) {
      doc.rect(50, y, 500, 20).fill("#fff").stroke();
    } else {
      doc.rect(50, y, 500, 20).fill("#f8f6f2").stroke();
    }

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("black")
      .text(item.name, 54, y + 5)
      .text(item.qty?.toString() || "-", 270, y + 5)
      .text(item.price?.toFixed(2) || "0.00", 340, y + 5)
      .text(((item.qty || 0) * (item.price || 0)).toFixed(2), 450, y + 5);

    y += 20;
  });

  // Totals (styled to match screenshot)
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("black")
    .text("SUB TOTAL", 340, y + 10)
    .text(totalAmount.toFixed(2), 450, y + 10)
    .text("VAT 16%", 340, y + 30)
    .text((totalAmount * 0.16).toFixed(2), 450, y + 30)
    .text("CLT 2%", 340, y + 50)
    .text((totalAmount * 0.02).toFixed(2), 450, y + 50)
    .text("SC 7%", 340, y + 70)
    .text((totalAmount * 0.07).toFixed(2), 450, y + 70)
    .text("TOTAL", 340, y + 90)
    .text((totalAmount * 1.25).toFixed(2), 450, y + 90);
}

function addFooter(doc: PDFKit.PDFDocument) {
  const startY = doc.y + 30;
  const leftX = 50;
  const rightX = 330;
  const boxWidth = 240;
  const boxHeight = 150;

  // Draw left box (Terms)
  doc
    .rect(leftX, startY, boxWidth, boxHeight)
    .strokeColor("#a07a3f")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#a07a3f")
    .text("Terms & Conditions", leftX + 8, startY + 8);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("black")
    .text(
      "1. Our credit terms are 30 days after dispatch of the invoice.\n" +
        "2. Duly signed LPO or Down payment is required to confirm booking.\n" +
        "3. The quotation is inclusive of all taxes.\n" +
        "4. Cancellation fee equivalent to 50% applies if within 48hrs.\n" +
        "5. No-show fee equivalent to 100% of the quote will be charged.",
      leftX + 8,
      startY + 28,
      { width: boxWidth - 16 }
    );

  // Draw right box (Bank Details)
  doc
    .rect(rightX, startY, boxWidth, boxHeight)
    .strokeColor("#a07a3f")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#a07a3f")
    .text("Bank Details", rightX + 8, startY + 8);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("black")
    .text(
      "BANK: KCB\n" +
        "ACCOUNT NAME: CIALA RESORT KENYA LIMITED\n" +
        "ACCOUNT NO: 123528287\n" +
        "BRANCH: KISUMU\n" +
        "RTGS IFSC CODE: KCBLKENX",
      rightX + 8,
      startY + 28,
      { width: boxWidth - 16 }
    );

  // Optional: Add a horizontal line above the footer for separation
  doc
    .moveTo(leftX, startY - 10)
    .lineTo(leftX + boxWidth * 2 + 30, startY - 10)
    .strokeColor("#a07a3f")
    .lineWidth(1)
    .stroke();

  // Move contact info further down
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("black")
    .text(
      "If you have any questions about this Quotation, please contact COLLINS OTIENO 0710 167449, Email: bdm@cialaresort.com",
      leftX,
      startY + boxHeight + 25,
      { width: boxWidth * 2 + 30, align: "center" }
    );
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

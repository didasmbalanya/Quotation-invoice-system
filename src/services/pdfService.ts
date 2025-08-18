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

  // Column positions and widths
  const descX = 54;
  const descWidth = 200;
  const qtyX = descX + descWidth + 10; // 264
  const qtyWidth = 50;
  const daysX = qtyX + qtyWidth + 10; // 324
  const daysWidth = 50;
  const priceX = daysX + daysWidth + 10; // 384
  const priceWidth = 60;
  const amountX = priceX + priceWidth + 10; // 454
  const amountWidth = 86;

  // Table Header
  doc.rect(50, y, 500, 20).fill(secondaryColor).stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("white")
    .text("DESCRIPTION", descX, y + 5, { width: descWidth })
    .text("QTY", qtyX, y + 5, { width: qtyWidth, align: "right" })
    .text("DAYS", daysX, y + 5, { width: daysWidth, align: "right" })
    .text("UNIT PRICE", priceX, y + 5, { width: priceWidth, align: "right" })
    .text("AMOUNT", amountX, y + 5, { width: amountWidth, align: "right" });

  y += 20;

  // Table Rows
  items.forEach((item, idx) => {
    const rowColor = idx % 2 === 0 ? "#fff" : "#f8f6f2";
    doc.rect(50, y, 500, 20).fill(rowColor).stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("black")
      .text(item.name, descX, y + 5, { width: descWidth })
      .text(item.qty?.toString() || "-", qtyX, y + 5, {
        width: qtyWidth,
        align: "right",
      })
      .text(item.days?.toString() || "-", daysX, y + 5, {
        width: daysWidth,
        align: "right",
      })
      .text(
        item.unitPrice?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) || "0.00",
        priceX,
        y + 5,
        { width: priceWidth, align: "right" }
      )
      .text(
        item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ||
          "0.00",
        amountX,
        y + 5,
        { width: amountWidth, align: "right" }
      );

    y += 20 + 3.5;

    // Render subItems if present
    if (item.subItems && Array.isArray(item.subItems)) {
      item.subItems.forEach((sub: string) => {
        // Dynamically calculate height for wrapped subitem text
        doc.font("Helvetica-Oblique").fontSize(9);
        const subHeight = doc.heightOfString(`• ${sub}`, {
          width: descWidth - 12,
        });

        doc.rect(50, y, 500, subHeight).fill(rowColor).stroke();
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor("#444")
          .text(`• ${sub}`, descX + 12, y + 3, { width: descWidth - 12 });

        y += subHeight + 4;
      });
    }
  });

  y += 10;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("black")
    .text("SUB TOTAL", priceX, y, { width: priceWidth, align: "right" })
    .text(
      totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      amountX,
      y,
      { width: amountWidth, align: "right" }
    )
    .text("VAT 16%", priceX, y + 18, { width: priceWidth, align: "right" })
    .text(
      (totalAmount * 0.16).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      amountX,
      y + 18,
      { width: amountWidth, align: "right" }
    )
    .text("CLT 2%", priceX, y + 36, { width: priceWidth, align: "right" })
    .text(
      (totalAmount * 0.02).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      amountX,
      y + 36,
      { width: amountWidth, align: "right" }
    )
    .text("SC 7%", priceX, y + 54, { width: priceWidth, align: "right" })
    .text(
      (totalAmount * 0.07).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      amountX,
      y + 54,
      { width: amountWidth, align: "right" }
    )
    .text("TOTAL", priceX, y + 72, { width: priceWidth, align: "right" })
    .text(
      (totalAmount * 1.25).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      amountX,
      y + 72,
      { width: amountWidth, align: "right" }
    );
}

function addFooter(doc: PDFKit.PDFDocument, totalAmount: number) {
  const minFooterY = doc.y + 30;
  const footerY = Math.max(doc.y + 30, minFooterY);

  // --- Terms & Conditions box (left) ---
  const leftX = 50;
  const boxWidth = 270;
  const boxHeight = 90;

  doc
    .rect(leftX, footerY, boxWidth, boxHeight)
    .strokeColor("#a07a3f")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#a07a3f")
    .text("Terms & Conditions", leftX + 8, footerY + 8);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("black")
    .text(
      "1. Our credit terms are 30 days after dispatch of the invoice.\n" +
        "2. Duly signed LPO or Down payment is required to confirm booking.\n" +
        "3. The quotation is inclusive of all taxes.\n" +
        "4. Cancellation fee equivalent to 50% applies if within 48hrs.\n" +
        "5. No-show fee equivalent to 100% of the quote will be charged.",
      leftX + 8,
      footerY + 28,
      { width: boxWidth - 16 }
    );

  // --- Bank Details (right of Terms & Conditions) ---
  const rightX = leftX + boxWidth + 20;
  const bankBoxWidth = 220;
  const bankBoxHeight = 90;

  doc
    .rect(rightX, footerY, bankBoxWidth, bankBoxHeight)
    .strokeColor("#a07a3f")
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#a07a3f")
    .text("Bank Details", rightX + 8, footerY + 8);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("black")
    .text("BANK", rightX + 8, footerY + 28, { continued: true })
    .font("Helvetica-Bold")
    .text(" : KCB")
    .font("Helvetica")
    .text("ACCOUNT NAME", rightX + 8, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(" : CIALA RESORT KENYA LIMITED")
    .font("Helvetica")
    .text("ACCOUNT NO", rightX + 8, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(" : 123528287")
    .font("Helvetica")
    .text("BRANCH", rightX + 8, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(" : KISUMU")
    .font("Helvetica")
    .text("RTGS IFSC CODE", rightX + 8, doc.y, { continued: true })
    .font("Helvetica-Bold")
    .text(" : KCBLKENX");

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("black")
    .text(
      "If you have any questions about this Quotation, please contact COLLINS OTIENO 0710 167449, Email: bdm@cialaresort.com",
      50,
      doc.page.height - 60,
      { width: 500, align: "center" }
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
  addFooter(doc, quotation.totalAmount); 

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
  addFooter(doc, quotation.totalAmount);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

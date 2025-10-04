import request from "supertest";

import app from "../src/app";
import { Quotation, Invoice } from "../src/models";
import sequelize from "../src/db";
import { randomUUID } from "node:crypto";

describe("API Endpoints", () => {
  let createdQuotationId: number;
  let createdInvoiceId: number;

  const items = [
    {
      name: "FULL DAY CONFERENCE 24TH - 26TH JUNE 2025",
      qty: 45,
      days: 3,
      unitPrice: 3500,
      amount: 472500.0,
      subItems: [
        "AM/PM TEAS, COFFEE, HOT MILK, HOT WATER AND SNACKS",
        "BUFFET LUNCH WITH A SOFT DRINK (soda or water)",
        "A bottle of mineral water for the morning and afternoon session",
        "Stationeries (Writing pads, pens, 1 flip chart and stand)",
        "P.A & projector",
        "Internet",
        "Conference hall",
      ],
    },
    {
      name: "ACCOMMODATION BB 23RD - 27TH JUNE 2025",
      qty: 5,
      days: 4,
      unitPrice: 12000,
      amount: 240000.0,
    },
    {
      name: "HB ACCOMMODATION 23RD - 27TH JUNE 2025",
      qty: 40,
      days: 4,
      unitPrice: 15000,
      amount: 2400000.0,
    },
    {
      name: "AIRPORT PICK UP & DROP OFF 23RD & 27TH JUNE 2025",
      qty: 2,
      days: 2,
      unitPrice: 3500,
      amount: 14000.0,
    },
  ];

  const sampleQuotation = {
    clientName: "John Doe",
    email: "john@example.com",
    uniqueQuotationId: randomUUID(),
    phone: "1234567890",
    quotationDate: new Date().toISOString(),
    items,
    status: "pending",
  };

  let updatedQuotationId: string;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    // update quototation
    const sampleQuotation2 = { ...sampleQuotation };
    const uniq = randomUUID();
    sampleQuotation2.uniqueQuotationId = uniq;

    const res = await request(app)
      .post("/api/quotations")
      .send(sampleQuotation2);

    updatedQuotationId = res.body.id;
  });

  afterAll(async () => {
    if (createdInvoiceId) {
      await Invoice.destroy({ where: { id: createdInvoiceId } });
    }
    if (createdQuotationId) {
      await Quotation.destroy({ where: { id: createdQuotationId } });
    }
    await sequelize.close();
  });

  describe("Quotation Endpoints", () => {
    it("should create a quotation", async () => {
      const res = await request(app)
        .post("/api/quotations")
        .send(sampleQuotation);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");

      createdQuotationId = res.body.id;
    });

    it("should list quotations", async () => {
      const res = await request(app).get("/api/quotations");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should update a quotation", async () => {
      const res = await request(app)
        .patch(`/api/quotations/${updatedQuotationId}`)
        .send({ status: "approved" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Quotation updated successfully"
      );
    });

    it("should get a quotation PDF", async () => {
      const res = await request(app).get(
        `/api/quotations/${createdQuotationId}/pdf`
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("application/pdf");
      expect(res.body).toBeInstanceOf(Buffer);
    });
  });

  describe("Invoice Endpoints", () => {
    it("should create an invoice from a quotation", async () => {
      const res = await request(app).post(
        `/api/invoices/${createdQuotationId}`
      );
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      createdInvoiceId = res.body.id;
    });

    it("should get an invoice PDF", async () => {
      const res = await request(app).get(
        `/api/invoices/${createdInvoiceId}/pdf`
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("application/pdf");
      expect(res.body).toBeInstanceOf(Buffer);
    });
  });
});

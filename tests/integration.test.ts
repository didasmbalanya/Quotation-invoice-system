import request from "supertest";

import app from "../src/app";
import { Quotation, Invoice } from "../src/models";
import sequelize from "../src/db";
import { randomUUID } from "node:crypto";

describe("API Endpoints", () => {
  let createdQuotationId: number;
  let createdInvoiceId: number;

  const sampleQuotation = {
    clientName: "John Doe",
    email: "john@example.com",
    uniqueQuotationId: randomUUID(),
    phone: "1234567890",
    quotationDate: new Date().toISOString(),
    items: JSON.stringify([{ name: "Pizza", qty: 2, price: 10 }]),
    totalAmount: 20,
    status: "pending",
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
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
        .patch(`/api/quotations/${createdQuotationId}`)
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

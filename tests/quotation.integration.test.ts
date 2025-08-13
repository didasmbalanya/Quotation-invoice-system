import request from "supertest";

import app from "../src/app";
import { Quotation } from "../src/models";
const { sequelize } = require("../src/models");

describe("Quotation Endpoints", () => {
  let createdQuotationId: number;

  const sampleQuotation = {
    clientName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    quotationDate: new Date().toISOString(),
    items: JSON.stringify([{ name: "Pizza", qty: 2, price: 10 }]),
    totalAmount: 20,
    status: "pending",
  };

  beforeAll(async () => {
    // set up a test database connection with sequelize
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
  })

  afterAll(async () => {
    // Clean up created quotation
    if (createdQuotationId) {
      await Quotation.destroy({ where: { id: createdQuotationId } });
    }

    sequelize.close();
  });

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

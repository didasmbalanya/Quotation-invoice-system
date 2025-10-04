import { Optional } from "sequelize";

export interface QuotationAttributes {
  id?: string;
  uniqueQuotationId: string;
  clientName: string;
  email: string;
  phone: string;
  quotationDate: Date;
  items: string | object;
  totalAmount: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceAttributes {
  id?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  quotationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type QuotationCreationAttributes = Optional<
  QuotationAttributes,
  "id" | "createdAt" | "updatedAt"
>;
export type InvoiceCreationAttributes = Optional<
  InvoiceAttributes,
  "id" | "createdAt" | "updatedAt"
>;

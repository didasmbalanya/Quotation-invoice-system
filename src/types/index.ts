import { Optional } from "sequelize";

export interface QuotationAttributes {
  id?: number;
  clientName: string;
  email: string;
  phone: string;
  quotationDate: Date;
  items: string;
  totalAmount: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceAttributes {
  id?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  quotationId: number;
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

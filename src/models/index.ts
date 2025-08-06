import { Model, DataTypes } from "sequelize";
import sequelize from "../db/index";
import {
  QuotationAttributes,
  InvoiceAttributes,
  InvoiceCreationAttributes,
  QuotationCreationAttributes,
} from "../types";

export class Quotation
  extends Model<QuotationAttributes, QuotationCreationAttributes>
  implements QuotationAttributes
{
  public id!: number;
  public clientName!: string;
  public email!: string;
  public phone!: string;
  public quotationDate!: Date;
  public items!: string;
  public totalAmount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  public id!: number;
  public invoiceNumber!: string;
  public invoiceDate!: Date;
  public quotationId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quotation.init(
  {
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quotationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Quotation",
  }
);

Invoice.init(
  {
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quotationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Quotation,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Invoice",
  }
);

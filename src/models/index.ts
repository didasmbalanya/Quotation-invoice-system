import { Model, DataTypes, UUIDV4 } from "sequelize";
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
  public id!: string;
  public clientName!: string;
  public uniqueQuotationId!: string;
  public email!: string;
  public phone!: string;
  public quotationDate!: Date;
  public items!: object | string; // Can be JSON object or stringified JSON
  public status!: "pending" | "approved" | "rejected";
  public totalAmount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  public id!: string;
  public invoiceNumber!: string;
  public invoiceDate!: Date;
  public quotationId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quotation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uniqueQuotationId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.JSON,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Quotation",
  }
);

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // generates a new UUID v4
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quotationId: {
      type: DataTypes.UUID,
      allowNull: false,
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

Invoice.belongsTo(Quotation, {
  foreignKey: 'quotationId',
  as: 'quotation', // optional alias
});

Quotation.hasMany(Invoice, {
  foreignKey: 'quotationId',
  as: 'invoices',
});

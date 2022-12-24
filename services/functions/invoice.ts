import { RDSDataService } from "aws-sdk";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";

interface Database {
  invoiceInfo: {
    invoice_id: number;
    prid: number;
    sid: number;
  };
  invoiceTaxTransaction: {
    invoice_id: number;
    invoice_tax_id: number;
  };
  invoiceDiscountTransaction: {
    invoice_id: number;
    invoice_discount_id: number;
  };
  invoiceLineTransaction: {
    invoice_id: number;
    invoice_transaction_id: number;
  };
  patientInfo: {
    patient_id: number;
  };
  parentOrgInfo: {
    contact_id: number;
  };
  paymentRequest: {
    prid: number;
  };
}

const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: process.env.DATABASE!,
      secretArn: process.env.SECRET_ARN!,
      resourceArn: process.env.CLUSTER_ARN!,
      client: new RDSDataService(),
    },
  }),
});

export async function handler(event: any) {
  let invoiceId = parseInt(event.pathParameters.id);
  const invoiceInfo = await db
    .selectFrom("invoiceInfo")
    .selectAll()
    .where("invoice_id", "=", invoiceId)
    .executeTakeFirst();

  const invoiceTaxTransaction = await db
    .selectFrom("invoiceTaxTransaction")
    .selectAll()
    .where("invoice_id", "=", invoiceId)
    .executeTakeFirst();
  const invoiceDiscountTransaction = await db
    .selectFrom("invoiceDiscountTransaction")
    .selectAll()
    .where("invoice_id", "=", invoiceId)
    .executeTakeFirst();
  const invoiceLineTransaction = await db
    .selectFrom("invoiceLineTransaction")
    .selectAll()
    .where("invoice_id", "=", invoiceId)
    .execute();
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        invoiceInfo,
        invoiceTaxTransaction,
        invoiceDiscountTransaction,
        invoiceLineTransaction,
      },
      status: "success",
    }),
  };
}

export async function create(event: any) {
  const {
    invoiceInfo,
    invoiceTaxTransaction,
    invoiceDiscountTransaction,
    invoiceLineTransaction,
  } = JSON.parse(event.body);
  const { invoice_id } = await db
    .insertInto("invoiceInfo")
    .values(invoiceInfo)
    .returning("invoice_id")
    .executeTakeFirstOrThrow();
  const { invoice_tax_id } = await db
    .insertInto("invoiceTaxTransaction")
    .values(invoiceTaxTransaction)
    .returning("invoice_tax_id")
    .executeTakeFirstOrThrow();
  const { invoice_discount_id } = await db
    .insertInto("invoiceDiscountTransaction")
    .values(invoiceDiscountTransaction)
    .returning("invoice_discount_id")
    .executeTakeFirstOrThrow();
  const { invoice_transaction_id } = await db
    .insertInto("invoiceLineTransaction")
    .values(invoiceLineTransaction)
    .returning("invoice_transaction_id")
    .executeTakeFirstOrThrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        invoice_id,
        invoice_tax_id,
        invoice_discount_id,
        invoice_transaction_id,
      },
      status: "success",
    }),
  };
}

import { RDSDataService } from "aws-sdk";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";

interface Database {
  invoiceMaster: {
    invoice_id: number;
    prid: number;
    sid: number;
  };
  patientMaster: {
    patient_id: number;
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
  let paymentId = parseInt(event.pathParameters.id);
  const record = await db
    .selectFrom("paymentRequest")
    .selectAll()
    .where("prid", "=", paymentId)
    .executeTakeFirst();
  console.log(record);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: record,
      status: "success",
    }),
  };
}

export async function create(event: any) {
  const payload = JSON.parse(event.body)
  const { prid } = await db
    .insertInto("paymentRequest")
    .values(payload)
    .returning("prid")
    .executeTakeFirstOrThrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: prid,
      status: "success",
    }),
  };
}

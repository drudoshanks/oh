import { RDSDataService } from "aws-sdk";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";

interface Database {
  transactions: {
    prlid: number;
    prid: number;
    prlvalue: number;
  };
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
  let transationId = parseInt(event.pathParameters.id);
  const record = await db
    .selectFrom("transactions")
    .selectAll()
    .where("prlid", "=", transationId)
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
  console.log(event.body);
  if(!event.body){
    return {
        statusCode: 500,
        body: JSON.stringify({
            status: "error",
            data: "Missing body"
        })
    }
  }
  const payload = JSON.parse(event.body);

  const { prlid } = await db
    .insertInto("transactions")
    .values(payload)
    .returning("prlid")
    .executeTakeFirstOrThrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: prlid,
      status: "success",
    }),
  };
}

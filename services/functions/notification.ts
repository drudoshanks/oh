import { RDSDataService } from "aws-sdk";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import fetch from "node-fetch";

interface Database {
  invoiceInfo: {
    invoice_id: number;
    prid: number;
    sid: number;
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
  paymentNotifications: {
    nid: number;
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
  const { invoiceId, patientId, paymentId } = event.queryStringParameters;
  const record = await db
    .selectFrom("patientInfo")
    .selectAll()
    .where("patient_id", "=", parseInt(patientId))
    .executeTakeFirst();
  const link = `www.abc.com?paymentId=${paymentId}&patientId=${patientId}&invoiceId=${invoiceId}.`;
  const body = `channel=whatsapp&source=917834811114&destination=${record?.phone}&message={"type":"text","text":"Your Payment is pending. Please complete it by clicking on ${link}"}&src.name=onehealth`;
  const response = await fetch("https://api.gupshup.io/sm/api/v1/msg", {
    body: body,
    headers: {
      Apikey: "9hmhoduaupwhqpc2tt8nntdkjqqd1i70",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const results = await response.json();
  const { nid } = await db
    .insertInto("paymentNotifications")
    .values({
      nid: 1,
      prid: parseInt(paymentId),
      pnsms: true,
      pnwhatsapp: false,
      pnemail: false,
      pnDateTime: Date(),
      status: true,
    })
    .returning("nid")
    .executeTakeFirstOrThrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "success",
      data: nid,
      link: link,
    }),
  };
}

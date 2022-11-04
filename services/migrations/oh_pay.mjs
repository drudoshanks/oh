import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  // status
  await db.schema
    .createTable("statusMaster")
    .addColumn("sid", "integer", col => col.primaryKey())
    .addColumn("sname", "text")
    .execute();

  // payment request
  await db.schema
    .createTable("paymentRequest")
    .addColumn("prid", "integer", col => col.primaryKey())
    .addColumn("pramount", "integer", col => col.notNull())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("patient_id", "integer") // patientMaster foreign key patient_id
    .addColumn("tax_id", "integer") // taxesMaster foreign key tax_id
    .addForeignKeyConstraint('foreign_key_invoice_id_pr', ['invoice_id'], 'invoiceMaster', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_patient_id_pr', ['patient_id'], 'patientMaster', ['patient_id'])
    .addForeignKeyConstraint('foreign_key_tax_id_pr', ['tax_id'], 'taxesMaster', ['tax_id'])
    .execute();

  // transactions
  await db.schema
    .createTable("transactionInfo")
    .addColumn("tid", "integer", col => col.primaryKey())
    .addColumn("prid", "integer", col => col.notNull()) // invoice master foreign key invoice_id
    .addColumn("sid", "integer") // status master foreign key sid
    .addForeignKeyConstraint('foreign_key_patient_id_t', ['prid'], 'paymentRequest', ['prid'])
    .addForeignKeyConstraint('foreign_key_branch_id_t', ['sid'], 'statusMaster', ['sid'])
    .execute();

  // notifications log
  await db.schema
    .createTable("notificationsLog")
    .addColumn("nid", "integer", col => col.primaryKey())
    .addColumn("tid", "integer", col => col.notNull())
    .addColumn("prid", "integer", col => col.notNull()) // invoice master foreign key invoice_id
    .addColumn("sid", "integer") // status master foreign key sid
    .addForeignKeyConstraint('foreign_key_patient_id_nl', ['prid'], 'paymentRequest', ['prid'])
    .addForeignKeyConstraint('foreign_key_tid_nl', ['tid'], 'transactionInfo', ['tid'])
    .addForeignKeyConstraint('foreign_key_branch_id_nl', ['sid'], 'statusMaster', ['sid'])
    .execute();

  // payment response log
  await db.schema
    .createTable("paymentResponseLog")
    .addColumn("prlid", "integer", col => col.primaryKey())
    .addColumn("prid", "integer", col => col.notNull()) // invoice master foreign key invoice_id
    .addColumn("prlvalue", 'varchar(255)', (col) => col.notNull())
    .addForeignKeyConstraint('foreign_key_patient_id_prl', ['prid'], 'paymentRequest', ['prid'])
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {

  await db.schema.dropTable("statusMaster").execute();
  await db.schema.dropTable("paymentRequest").execute();
  await db.schema.dropTable("transactionInfo").execute();
  await db.schema.dropTable("notificationsLog").execute();
  await db.schema.dropTable("paymentResponseLog").execute();
}
import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  //  org info
  await db.schema
    .createTable("parentOrgInfo")
    .addColumn("parent_org_id", "integer", col => col.primaryKey())
    .addColumn("phone", "integer", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email2", "text")
    .addColumn("email3", "text")
    .addColumn("name",'varchar(255)', (col) => col.notNull().unique())
    .addColumn("mobile_alt", "text")
    .addColumn("logo", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .execute();

  // hospital org info
  await db.schema
    .createTable("hospitalOrgInfo")
    .addColumn("org_id", "integer", col => col.primaryKey())
    .addColumn("parent_org_id", "integer") // hospitalOrg foreign key org_id
    .addColumn("phone", "integer", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email2", "text")
    .addColumn("email3", "text")
    .addColumn("name",'varchar(255)', (col) => col.notNull().unique())
    .addColumn("mobile_alt", "text")
    .addColumn("logo", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .addForeignKeyConstraint('foreign_key_parent_org_id', ['parent_org_id'], 'parentOrgInfo', ['parent_org_id'])
    .execute();

  // hospital branch Info
  await db.schema
    .createTable("hospitalBranchInfo")
    .addColumn("branch_id", "integer", col => col.primaryKey())
    .addColumn("hospital_org_id", "integer") // hospitalOrg foreign key org_id
    .addColumn("phone", "integer", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email2", "text")
    .addColumn("email3", "text")
    .addColumn("name",'varchar(255)', (col) => col.notNull().unique())
    .addColumn("mobile_alt", "text")
    .addColumn("logo", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .addForeignKeyConstraint('foreign_key_hospital_org_id', ['hospital_org_id'], 'hospitalOrgInfo', ['org_id'])
    .execute();


    // hospital branch Info
    await db.schema
        .createTable("billerInfo")
        .addColumn("biller_id", "integer", col => col.primaryKey())
        .addColumn("branch_id", "integer") // hospitalOrg foreign key org_id
        .addColumn("phone", "integer", (col) => col.notNull().unique())
        .addColumn("email", "text", (col) => col.notNull().unique())
        .addColumn("biller_first_name",'varchar(255)')
        .addColumn("biller_last_name",'varchar(255)')
        .addColumn("mobile_alt", "text")
        .addForeignKeyConstraint('foreign_key_hospital_org_id', ['branch_id'], 'hospitalBranchInfo', ['branch_id'])
        .execute();

  // patient Info
  await db.schema
    .createTable("patientInfo")
    .addColumn("patient_id", "integer", col => col.primaryKey())
    .addColumn("biller_id", "integer") // biller foreign key branch_id
    .addColumn("phone", "integer", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("name",'varchar(255)', (col) => col.notNull().unique())
    .addColumn("last_name",'varchar(255)')
    .addColumn("mobile_alt", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .addForeignKeyConstraint('foreign_key_biller_id', ['biller_id'], 'billerInfo', ['biller_id'])
    .execute();

  // tax Info
  await db.schema
    .createTable("taxeInfo")
    .addColumn("tax_id", "integer", col => col.primaryKey())
    .addColumn("tax_name", "text")
    .addColumn("tax_amount", "integer")
    .execute();

  // discount Info
  await db.schema
    .createTable("discountInfo")
    .addColumn("discount_id", "integer", col => col.primaryKey())
    .addColumn("discount_name", "text")
    .addColumn("discount_amount", "integer")
    .execute();

  // line item Info  
  await db.schema
    .createTable("lineItemsInfo")
    .addColumn("line_item_id", "integer", col => col.primaryKey())
    .addColumn("item_name", "text")
    .addColumn("item_amount", "integer")
    .addColumn("item_description", "text")
    .addColumn("item_expiry_date", "text")
    .execute();

  // invoice Info  
  await db.schema
    .createTable("invoiceInfo")
    .addColumn("invoice_id", "integer", col => col.primaryKey())
    .addColumn("patient_id", "integer") // patientMaster foreign key patient_id
    .addColumn("branch_id", "integer") // hospital branch foreign key branch_id
    .addForeignKeyConstraint('foreign_key_patient_id', ['patient_id'], 'patientInfo', ['patient_id'])
    .addForeignKeyConstraint('foreign_key_branch_id', ['branch_id'], 'hospitalBranchInfo', ['branch_id'])
    .addColumn("invoice_amount", "integer")
    .addColumn("invoice_description", "text")
    .execute();

  // invoice tax item transaction
  await db.schema
    .createTable("invoiceTaxTransaction")
    .addColumn("invoice_tax_id", "integer", col => col.primaryKey())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("tax_id", "integer") // line master foreign key line_id
    .addForeignKeyConstraint('foreign_key_invoice_id', ['invoice_id'], 'invoiceInfo', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_tax_id', ['tax_id'], 'taxeInfo', ['tax_id'])
    .execute();

  // invoice discount item transaction
  await db.schema
    .createTable("invoiceDiscountTransaction")
    .addColumn("invoice_discount_id", "integer", col => col.primaryKey())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("discount_id", "integer") // line master foreign key line_id
    .addForeignKeyConstraint('foreign_key_invoice_id', ['invoice_id'], 'invoiceInfo', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_discount_id', ['discount_id'], 'discountInfo', ['discount_id'])
    .execute();

  // invoice line item transaction
  await db.schema
    .createTable("invoiceLineTransaction")
    .addColumn("invoice_transaction_id", "integer", col => col.primaryKey())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("line_id", "integer") // line master foreign key line_id
    .addForeignKeyConstraint('foreign_key_invoice_id', ['invoice_id'], 'invoiceInfo', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_line_id', ['line_id'], 'lineItemsInfo', ['line_item_id'])
    .execute();

  // status
  // await db.schema
  //   .createTable("statusInfo")
  //   .addColumn("sid", "integer", col => col.primaryKey())
  //   .addColumn("sname", "text")
  //   .execute();

  // payment request
  await db.schema
    .createTable("paymentRequest")
    .addColumn("prid", "integer", col => col.primaryKey())
    .addColumn("pramount", "integer", col => col.notNull())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("patient_id", "integer",  col => col.notNull()) // patientMaster foreign key patient_id
    .addColumn("prDateTime", "text" ,  col => col.notNull())  // date time
    .addForeignKeyConstraint('foreign_key_invoice_id_pr', ['invoice_id'], 'invoiceInfo', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_patient_id_pr', ['patient_id'], 'patientInfo', ['patient_id'])
    .execute();

  // payment notifications
  await db.schema
    .createTable("paymentNotifications")
    .addColumn("nid", "integer", col => col.primaryKey())
    .addColumn("prid", "integer", col => col.notNull()) // invoice master foreign key invoice_id
    // .addColumn("sid", "integer") // status master foreign key sid
    .addColumn("pnwhatsapp", "boolean")
    .addColumn("pnsms", "boolean")
    .addColumn("pnemail", "boolean")
    .addColumn("pnwhatsappRec", "boolean")
    .addColumn("pnsmsRec", "boolean")
    .addColumn("pnemailRec", "boolean")
    // .addColumn("pnname", "text")  // whatsapp , sms , email , telegram
    .addColumn("pnDateTime", "text")  // date time
    .addColumn("pnDateTimeWhatsapp", "text")  // date time
    .addColumn("pnDateTimeEmail", "text")  // date time
    .addColumn("pnDateTimeSms", "text")  // date time
    .addColumn("status", "boolean") 
    .addForeignKeyConstraint('foreign_key_patient_id_nl', ['prid'], 'paymentRequest', ['prid'])
    // .addForeignKeyConstraint('foreign_key_branch_id_nl', ['sid'], 'statusInfo', ['sid'])
    .execute();

  // payment response log
  await db.schema
    .createTable("transactions")
    .addColumn("prlid", "integer", col => col.primaryKey())
    .addColumn("prid", "integer", col => col.notNull()) // invoice master foreign key invoice_id
    .addColumn("prlvalue", 'varchar(255)', (col) => col.notNull())
    .addColumn("prtype", "text")  // type of payment  cod, card , upi 
    .addColumn("prtamount", "text")  // amount
    .addColumn("prtstatus", "text")  // success , fail , pending , etc
    .addForeignKeyConstraint('foreign_key_patient_id_prl', ['prid'], 'paymentRequest', ['prid'])
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("parentOrgInfo").execute();
  await db.schema.dropTable("hospitalOrgInfo").execute();
  await db.schema.dropTable("hospitalBranchInfo").execute();
  await db.schema.dropTable("billerInfo").execute();
  await db.schema.dropTable("patientInfo").execute();
  await db.schema.dropTable("taxeInfo").execute();
  await db.schema.dropTable("discountInfo").execute();
  await db.schema.dropTable("lineItemsInfo").execute();
  await db.schema.dropTable("invoiceInfo").execute();
  await db.schema.dropTable("invoiceTaxTransaction").execute();
  await db.schema.dropTable("invoiceDiscountTransaction").execute();
  await db.schema.dropTable("invoiceLineTransaction").execute();
  await db.schema.dropTable("paymentRequest").execute();
  await db.schema.dropTable("paymentNotifications").execute();
  await db.schema.dropTable("transactions").execute();
}
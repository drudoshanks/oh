import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  // contact master
  await db.schema
    .createTable("contactsMaster")
    .addColumn("contact_id", "integer", col => col.primaryKey())
    .addColumn("phone", "integer", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("name",'varchar(255)', (col) => col.notNull().unique())
    .addColumn("last_name",'varchar(255)')
    .addColumn("mobile_alt", "text")
    .addColumn("logo", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .execute();

  // hospital org master
  await db.schema
    .createTable("hospitalOrgMaster")
    .addColumn("org_id", "integer", col => col.primaryKey())
    .addColumn("contact_id", "integer") // contactMaster foreign key contact_id
    .addForeignKeyConstraint('foreign_key_contact_id', ['contact_id'], 'contactsMaster', ['contact_id'])
    .execute();

  // hospital branch master
  await db.schema
    .createTable("hospitalBranchMaster")
    .addColumn("branch_id", "integer", col => col.primaryKey())
    .addColumn("parent_org_id", "integer") // hospitalOrg foreign key org_id
    .addColumn("contact_id", "integer") // contactMaster foreign key contact_id
    .addForeignKeyConstraint('foreign_key_parent_org_id', ['parent_org_id'], 'hospitalOrgMaster', ['org_id'])
    .addForeignKeyConstraint('foreign_key_contact_id', ['contact_id'], 'contactsMaster', ['contact_id'])
    .execute();

  // patient master
  await db.schema
    .createTable("patientMaster")
    .addColumn("patient_id", "integer", col => col.primaryKey())
    .addColumn("branch_id", "integer") // hospital branch foreign key branch_id
    .addColumn("contact_id", "integer") // contactMaster foreign key contact_id
    .addForeignKeyConstraint('foreign_key_branch_id', ['branch_id'], 'hospitalBranchMaster', ['branch_id'])
    .addForeignKeyConstraint('foreign_key_contact_id', ['contact_id'], 'contactsMaster', ['contact_id'])
    .execute();

  // tax master
  await db.schema
    .createTable("taxesMaster")
    .addColumn("tax_id", "integer", col => col.primaryKey())
    .addColumn("tax_name", "text")
    .addColumn("tax_amount", "integer")
    .execute();

  // line item master  
  await db.schema
    .createTable("lineItemsMaster")
    .addColumn("line_item_id", "integer", col => col.primaryKey())
    .addColumn("item_name", "text")
    .addColumn("item_amount", "integer")
    .addColumn("item_description", "text")
    .addColumn("item_expiry_date", "text")
    .execute();

  // invoice master  
  await db.schema
    .createTable("invoiceMaster")
    .addColumn("invoice_id", "integer", col => col.primaryKey())
    .addColumn("patient_id", "integer") // patientMaster foreign key patient_id
    .addColumn("branch_id", "integer") // hospital branch foreign key branch_id
    .addColumn("tax_id", "integer") // taxesMaster foreign key tax_id
    .addForeignKeyConstraint('foreign_key_patient_id', ['patient_id'], 'patientMaster', ['patient_id'])
    .addForeignKeyConstraint('foreign_key_branch_id', ['branch_id'], 'hospitalBranchMaster', ['branch_id'])
    .addForeignKeyConstraint('foreign_key_tax_id', ['tax_id'], 'taxesMaster', ['tax_id'])
    .addColumn("invoice_amount", "integer")
    .addColumn("invoice_description", "text")
    .execute();

  // invoice line item transaction
  await db.schema
    .createTable("invoiceLineTransaction")
    .addColumn("invoice_transaction_id", "integer", col => col.primaryKey())
    .addColumn("invoice_id", "integer") // invoice master foreign key invoice_id
    .addColumn("line_id", "integer") // line master foreign key line_id
    .addForeignKeyConstraint('foreign_key_invoice_id', ['invoice_id'], 'invoiceMaster', ['invoice_id'])
    .addForeignKeyConstraint('foreign_key_line_id', ['line_id'], 'lineItemsMaster', ['line_item_id'])
    .execute();

  // payment request

  // transaction info
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("contactsMaster").execute();
  await db.schema.dropTable("hospitalOrgMaster").execute();
  await db.schema.dropTable("hospitalBranchMaster").execute();
  await db.schema.dropTable("patientMaster").execute();
  await db.schema.dropTable("taxesMaster").execute();
  await db.schema.dropTable("lineItemsMaster").execute();
  await db.schema.dropTable("invoiceMaster").execute();
  await db.schema.dropTable("invoiceLineTransaction").execute();
}
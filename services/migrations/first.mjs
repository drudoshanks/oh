import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("hospitalOrg")
    .addColumn("org_id", "integer", col => col.primaryKey())
    .addColumn("org_name", "text")
    .addColumn("org_logo", "text")
    .execute();

  await db.schema
    .createTable("org_contacts")
    .addColumn("phone", "integer", col => col.primaryKey())
    .addColumn("email", "text")
    .addColumn("address_line_1", "text")
    .addColumn("address_line_2", "text")
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("country", "text")
    .addColumn("zip", "text")
    .execute();


  // await db.schema
  //   .createTable("org_contacts")
  //   .addColumn("phone", "integer", col => col.primaryKey())
  //   .addColumn("email", "text")
  //   .addColumn("address_line_1", "text")
  //   .addColumn("address_line_2", "text")
  //   .addColumn("city", "text")
  //   .addColumn("state", "text")
  //   .addColumn("country", "text")
  //   .addColumn("zip", "text")
  //   .execute();

}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("hospitalOrg").execute();
  await db.schema.dropTable("org_contacts").execute();
}
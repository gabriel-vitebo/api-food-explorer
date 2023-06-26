exports.up = (knex) =>
  knex.schema.createTable("favorites", (table) => {
    table.text("id").primary();
    table.text("food_id").references("id").inTable("foods");
    table.text("user_id").references("id").inTable("users");
  });

exports.down = (knex) => knex.schema.dropTable("favorites");

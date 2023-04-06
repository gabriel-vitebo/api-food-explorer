exports.up = (knex) =>
  knex.schema.createTable("categories", (table) => {
    table.text("id").primary()
    table.text("name")
  })

exports.down = (knex) => knex.schema.dropTable("categories")

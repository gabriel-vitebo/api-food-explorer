exports.up = (knex) =>
  knex.schema.createTable("ingredients", (table) => {
    table.text("id").primary()
    table.text("name")
  })

exports.down = (knex) => knex.schema.dropTable("ingredients")

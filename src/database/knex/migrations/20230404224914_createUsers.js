exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.text("id").primary()
    table.text("name")
    table.text("email").unique()
    table.text("password")
    table.boolean("isAdm")
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("users")

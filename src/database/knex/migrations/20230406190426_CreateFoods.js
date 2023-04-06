exports.up = (knex) =>
  knex.schema.createTable("foods", (table) => {
    table.text("id").primary()
    table.text("name")
    table.text("description")
    table.integer("price").notNullable()
    table.text("image").notNullable()
    table.text("category_id").references("id").inTable("categories")
    table.text("author_id").references("id").inTable("users")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("foods")

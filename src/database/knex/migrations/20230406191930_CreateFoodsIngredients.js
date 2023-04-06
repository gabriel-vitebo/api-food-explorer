exports.up = (knex) =>
  knex.schema.createTable("foodsIngredients", (table) => {
    table.text("id").primary()
    table.text("food_id").references("id").inTable("foods")
    table.text("ingredients_id").references("id").inTable("ingredients")
  })

exports.down = (knex) => knex.schema.dropTable("foods")

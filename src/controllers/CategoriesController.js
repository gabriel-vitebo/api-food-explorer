const knex = require("../database/knex")
const { v4: uuidv4 } = require("uuid")

class CategoriesController {
  async create(request, response) {
    const { name } = request.body

    await knex("categories").insert({
      id: uuidv4(),
      name,
    })

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const showCategory = await knex("categories")
      .select([
        "categories.name as categoryName",
        "foods.name as foodName",
        "foods.description",
        "foods.price",
        "foods.image",
        "foods.id as foodId",
        "foods.category_id as foodCategoriesId",
        "categories.id as categoriesId",
      ])
      .innerJoin("foods", "foodCategoriesId", "categoriesId")
      .where("foodCategoriesId", id)
      .orderBy("categoryName")
    return response.json(showCategory)
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("categories").where({ id }).delete()
    return response.json()
  }

  async index(request, response) {
    const { name } = request.query

    const categories = await knex("categories")
      .select([
        "categories.name as categoryName",
        "foods.name as foodName",
        "foods.description",
        "foods.price",
        "foods.image",
      ])
      .innerJoin("foods", "categories.id", "foods.category_id")
      .whereLike("categoryName", `%${name}%`)
    return response.json(categories)
  }

  async getAll(_request, response) {
    const allCategoryName = await knex("categories").select("name", "id")

    return response.json(allCategoryName)
  }
}

module.exports = CategoriesController

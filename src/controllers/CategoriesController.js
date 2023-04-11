const knex = require("../database/knex")
const { v4: uuidv4 } = require("uuid")

class CategoriesController {
  async create(request, response) {
    const { name } = request.body

    await knex("categories").insert({
      id: uuidv4(),
      name,
    })

    response.json()
  }
}

module.exports = CategoriesController

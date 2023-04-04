const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdm } = request.body
    await knex("users").insert({ name, email, password, isAdm })
    response.json()
  }
}

module.exports = UsersController

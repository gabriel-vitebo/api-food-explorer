const { hash } = require("bcryptjs")
const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { uuid } = require("uuidv4")

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdm } = request.body

    const emailInUse = await knex
      .select()
      .table("users")
      .where("email", email)
      .first()
    console.log({ emailInUse })
    if (emailInUse) {
      throw new AppError("Esse email já está em uso!")
    }

    const hashedPassword = await hash(password, 8)

    const id = uuid()

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      isAdm,
      id,
    })
    response.json()
  }
}

module.exports = UsersController

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
    if (emailInUse) {
      throw new AppError("Esse email já está em uso!")
    }
    console.log({ password })
    if (password.length < 6) {
      console.log({ password })
      throw new AppError("senha deve conter no mínimo de 6 caracteres")
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

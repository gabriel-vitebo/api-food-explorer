const AppError = require("../utils/AppError")

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdm } = request.body
    if (!name) {
      throw new AppError("hello")
    }
    response.json({ name, email, password, isAdm })
  }
}

module.exports = UsersController

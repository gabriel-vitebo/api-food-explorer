const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class FoodImageController {
  async update(request, response) {
    const { id } = request.params
    const foodFileName = request.file.filename

    const diskStorage = new DiskStorage()

    const food = await knex("foods").where({ id }).first()

    if (!food) {
      throw new AppError("Somente administradores podem mudar a imagem")
    }

    if (food.image) {
      await diskStorage.deleteFile(food.image)
    }

    const filename = await diskStorage.saveFile(foodFileName)
    food.image = filename

    await knex("foods").update(food).where({ id })

    return response.json(food)
  }
}

module.exports = FoodImageController

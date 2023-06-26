const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");

class FavoritesController {
  async adding(request, response) {
    const { food_id } = request.body;
    const user_id = request.user.id;

    await knex("favorites").insert({
      id: uuidv4(),
      food_id,
      user_id,
    });

    return response.json();
  }

  async delete(request, response) {
    const { food_id } = request.params;
    const user_id = request.user.id;

    const favoriteFood = await knex("favorites")
      .where({
        food_id,
        user_id,
      })
      .first();

    if (!favoriteFood) {
      throw new AppError("prato não foi encontrado na lista de favoritos");
    }

    await knex("favorites")
      .where({
        food_id,
        user_id,
      })
      .delete();

    return response.json();
  }
}

module.exports = FavoritesController;

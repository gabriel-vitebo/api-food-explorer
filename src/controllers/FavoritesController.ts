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

  async show(request, response) {
    const user_id = request.user.id;
    console.log({ user_id });

    const foodIds = await knex("favorites")
      .where("user_id", user_id)
      .select("food_id");

    console.log({ foodIds });

    response.json({ foodIds });
  }
}

module.exports = FavoritesController;

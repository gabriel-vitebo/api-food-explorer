const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");

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
}

module.exports = FavoritesController;

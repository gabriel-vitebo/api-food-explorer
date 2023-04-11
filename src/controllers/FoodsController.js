const knex = require("../database/knex")
const { v4: uuidv4 } = require("uuid")

class FoodsController {
  async create(request, response) {
    const { name, description, price, image, ingredients } = request.body
    const { author_id } = request.params

    const food_id = uuidv4()

    await knex("foods").insert({
      id: food_id,
      name,
      description,
      price,
      image,
      author_id,
    })

    const savedIngredients = await knex("ingredients").where((qb) => {
      ingredients.forEach((ingredient) => {
        qb.orWhere("ingredients.name", "=", ingredient)
      })
    })

    const newIngredients = ingredients.filter((ingredient) => {
      if (savedIngredients.length > 0) {
        const isNewIngredient = savedIngredients.every((savedIngredient) => {
          return ingredient != savedIngredient.name
        })

        return isNewIngredient
      }

      return true
    })

    console.log({ savedIngredients })

    const newIngredientsToSave = newIngredients.map((ingredient) => {
      return {
        id: uuidv4(),
        name: ingredient,
      }
    })

    if (newIngredientsToSave.length > 0) {
      await knex("ingredients").insert(newIngredientsToSave)
    }

    const allIngredientsInTheFood = [
      ...newIngredientsToSave,
      ...savedIngredients,
    ]

    const foodsIngredients = allIngredientsInTheFood.map((ingredient) => {
      return {
        id: uuidv4(),
        food_id,
        ingredients_id: ingredient.id,
      }
    })

    await knex("foodsIngredients").insert(foodsIngredients)

    response.json()
  }
}

module.exports = FoodsController

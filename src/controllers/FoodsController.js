const knex = require("../database/knex")
const { v4: uuidv4 } = require("uuid")
const AppError = require("../utils/AppError")

class FoodsController {
  async create(request, response) {
    const { name, description, price, image, ingredients, categoryId } =
      request.body
    const { author_id } = request.params

    const food_id = uuidv4()

    const author = await knex
      .select()
      .table("users")
      .where("id", author_id)
      .first()

    if (typeof author === "undefined" || author.isAdm === 0) {
      throw new AppError("Somente administradores podem criar um prato")
    }

    console.log({ author })

    await knex("foods").insert({
      id: food_id,
      name,
      description,
      price,
      image,
      author_id,
      category_id: categoryId,
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

  async update(request, response) {
    const { name, description, price, image } = request.body
    const { id } = request.params

    await knex("foods").where({ id }).update({
      name,
      description,
      price,
      image,
    })

    return response.json()
  }

  async showDetails(request, response) {
    const { id } = request.params

    const [ingredients, food] = await Promise.all([
      knex("foods")
        .select(["ingredients.name"])
        .innerJoin("foodsIngredients", `foods.id`, "foodsIngredients.food_id")
        .where("foodsIngredients.food_id", "=", id)
        .innerJoin(
          "ingredients",
          "ingredients.id",
          "foodsIngredients.ingredients_id"
        ),
      knex("foods").select().where({ id }).first(),
    ])

    const dto = {
      food: {
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
      },
      ingredients: ingredients.map((ingredient) => {
        return ingredient.name
      }),
    }
    response.json({
      ...dto,
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("foods").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { name, ingredients } = request.query

    let listingTheFoods
    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())

      listingTheFoods = await knex("ingredients")
        .select([
          "ingredients.name as ingredientsName",
          "foodsIngredients.ingredients_id",
          "foods.name as foodsName",
        ])
        .innerJoin(
          "foodsIngredients",
          "ingredients.id",
          "foodsIngredients.ingredients_id"
        )
        .whereIn("ingredientsName", filterIngredients)
        .innerJoin("foods", "foods.id", "foodsIngredients.food_id")
    } else {
      listingTheFoods = await knex("foods")
        .whereLike("name", `%${name}%`)
        .orderBy("name")
    }

    console.log({ listingTheFoods })

    return response.json(listingTheFoods)
  }
}

module.exports = FoodsController

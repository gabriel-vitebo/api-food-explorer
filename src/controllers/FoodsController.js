const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");
const auth = require("../configs/auth");
const { baseUrl } = require("../utils/Constants");
const DiskStorage = require("../providers/DiskStorage");

class FoodsController {
  async create(request, response) {
    const {
      name,
      description,
      price,
      ingredients: ingredientsString,
      categoryId,
    } = request.body;

    const diskStorage = new DiskStorage();

    const fileName = request.file.filename;

    const foodFileName = await diskStorage.saveFile(fileName);

    const ingredients = JSON.parse(ingredientsString);

    const user_id = request.user.id;

    const food_id = uuidv4();

    const author = await knex
      .select()
      .table("users")
      .where("id", user_id)
      .first();

    if (typeof author === "undefined" || author.isAdm === 0) {
      throw new AppError("Somente administradores podem criar um prato");
    }

    await knex("foods").insert({
      id: food_id,
      name,
      description,
      image: foodFileName,
      price,
      author_id: user_id,
      category_id: categoryId,
    });

    const savedIngredients = await knex("ingredients").where((qb) => {
      ingredients.forEach((ingredient) => {
        qb.orWhere("ingredients.name", "=", ingredient);
      });
    });

    const newIngredients = ingredients.filter((ingredient) => {
      if (savedIngredients.length > 0) {
        const isNewIngredient = savedIngredients.every((savedIngredient) => {
          return ingredient != savedIngredient.name;
        });

        return isNewIngredient;
      }

      return true;
    });

    const newIngredientsToSave = newIngredients.map((ingredient) => {
      return {
        id: uuidv4(),
        name: ingredient,
      };
    });

    if (newIngredientsToSave.length > 0) {
      await knex("ingredients").insert(newIngredientsToSave);
    }

    const allIngredientsInTheFood = [
      ...newIngredientsToSave,
      ...savedIngredients,
    ];

    const foodsIngredients = allIngredientsInTheFood.map((ingredient) => {
      return {
        id: uuidv4(),
        food_id,
        ingredients_id: ingredient.id,
      };
    });

    await knex("foodsIngredients").insert(foodsIngredients);

    return response.json();
  }

  async update(request, response) {
    const {
      name,
      description,
      price,
      categoryId,
      ingredients: ingredientsString,
    } = request.body;

    const { id } = request.params;

    const fileName = request?.file?.filename;
    console.log({ fileName });

    const food = await knex("foods").select("image").where({ id }).first();

    const diskStorage = new DiskStorage();

    const ingredients = JSON.parse(ingredientsString);
    console.log({ ingredients });

    if (food.image && fileName) {
      await diskStorage.deleteFile(food.image);
    }
    if (fileName) {
      const filename = await diskStorage.saveFile(fileName);
      food.image = filename;
    }

    await knex("foods").where({ id }).update({
      name,
      description,
      price,
      image: food.image,
      category_id: categoryId,
    });

    const savedIngredients = await knex("ingredients").where((qb) => {
      ingredients.forEach((ingredient) => {
        qb.orWhere("ingredients.name", "=", ingredient);
      });
    });

    const newIngredients = ingredients.filter((ingredient) => {
      if (savedIngredients.length > 0) {
        const isNewIngredient = savedIngredients.every((savedIngredient) => {
          return ingredient != savedIngredient.name;
        });

        return isNewIngredient;
      }

      return true;
    });

    const newIngredientsToSave = newIngredients.map((ingredient) => {
      return {
        id: uuidv4(),
        name: ingredient,
      };
    });

    if (newIngredientsToSave.length > 0) {
      await knex("ingredients").insert(newIngredientsToSave);
    }

    const allIngredientsInTheFood = [
      ...newIngredientsToSave,
      ...savedIngredients,
    ];

    console.log({ allIngredientsInTheFood });

    const foodsIngredients = allIngredientsInTheFood.map((ingredient) => {
      return {
        id: uuidv4(),
        food_id: id,
        ingredients_id: ingredient.id,
      };
    });
    console.log({ foodsIngredients });

    await knex("foodsIngredients").where("food_id", id).del();

    await knex("foodsIngredients").insert(foodsIngredients);

    return response.json();
  }

  async showDetails(request, response) {
    const { id } = request.params;

    const [ingredients, food] = await Promise.all([
      knex("foods")
        .select(["ingredients.name", "category_id"])
        .innerJoin("foodsIngredients", `foods.id`, "foodsIngredients.food_id")
        .where("foodsIngredients.food_id", "=", id)
        .innerJoin(
          "ingredients",
          "ingredients.id",
          "foodsIngredients.ingredients_id"
        ),
      knex("foods").select().where({ id }).first(),
    ]);

    const dto = {
      food: {
        name: food.name,
        description: food.description,
        price: food.price,
        image: `${baseUrl}/files/${food.image}`,
        categoryId: food.category_id,
      },
      ingredients: ingredients.map((ingredient) => {
        return ingredient.name;
      }),
    };
    return response.json({
      ...dto,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("foods").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { name } = request.query;
    const foodsMatch = await knex("foods")
      .whereLike("name", `%${name}%`)
      .orderBy("name");

    const ingredientsMatch = await knex("ingredients").whereLike(
      "name",
      `%${name}%`
    );

    if (ingredientsMatch.length > 0) {
      const ingredientsIds = ingredientsMatch.map((ingredient) => {
        return ingredient.id;
      });
      // buscar o ID das comidas que deram match com os ingredientes buscados
      const ingredientsXfoods = await knex("foodsIngredients").where(
        "ingredients_id",
        ingredientsIds
      );
      // buscar na tabela de foods todas as foods que vieram na query de cima

      console.log({ ingredientsXfoods });

      // juntar os arrays as comidas que deram match por ingredientes com as comidas que deram match pelo nome

      // remover as duplicatas do array
    }

    const dto = foodsMatch.map((listingTheFood) => {
      return {
        id: listingTheFood.id,
        name: listingTheFood.name,
        description: listingTheFood.description,
        price: listingTheFood.price,
        image: `${baseUrl}/files/${listingTheFood.image}`,
      };
    });

    return response.json(dto);
  }
}

module.exports = FoodsController;

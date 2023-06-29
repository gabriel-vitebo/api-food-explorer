const knex = require("../database/knex");
const { v4: uuidv4 } = require("uuid");
const { baseUrl } = require("../utils/Constants");

class CategoriesController {
  async create(request, response) {
    const { name } = request.body;

    await knex("categories").insert({
      id: uuidv4(),
      name,
    });

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const showCategory = await knex("categories")
      .select([
        "categories.name as categoryName",
        "foods.name as foodName",
        "foods.description",
        "foods.price",
        "foods.image",
        "foods.id as foodId",
        "foods.category_id as foodCategoriesId",
        "categories.id as categoriesId",
      ])
      .join("foods", "foodCategoriesId", "categoriesId")
      .where("foodCategoriesId", id);

    return response.json(showCategory);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("categories").where({ id }).delete();
    return response.json();
  }

  async index(request, response) {
    const categories = await knex("categories")
      .select([
        "categories.name as categoryName",
        "foods.name as foodName",
        "foods.description",
        "foods.price",
        "foods.image",
        "foods.category_id",
        "categories.id",
        "foods.id as foodId",
      ])
      .innerJoin("foods", "categories.id", "foods.category_id")
      .distinct();

    const responseData = categories.map((category) => {
      return {
        name: category.categoryName,
        categoryId: category.id,
        // __TEMP___: category,
        foods: categories
          .filter((item) => {
            return item.category_id === category.id;
          })
          .map((item) => {
            return {
              foodId: item.foodId,
              name: item.foodName,
              price: item.price,
              image: `${baseUrl}/files/${item.image}`,
            };
          }),
      };
    });
    return response.json(responseData);
  }

  async getAll(_request, response) {
    const allCategoryName = await knex("categories").select("name", "id");

    return response.json(allCategoryName);
  }
}

module.exports = CategoriesController;

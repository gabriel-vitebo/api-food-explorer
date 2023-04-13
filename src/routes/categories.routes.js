const { Router } = require("express")

const CategoriesController = require("../controllers/CategoriesController")
const categoriesRoutes = Router()

const categoriesController = new CategoriesController()

categoriesRoutes.get("/", categoriesController.index)
categoriesRoutes.post("/", categoriesController.create)
categoriesRoutes.get("/:id", categoriesController.show)
categoriesRoutes.delete("/:id", categoriesController.delete)

module.exports = categoriesRoutes

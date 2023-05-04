const { Router } = require("express")

const CategoriesController = require("../controllers/CategoriesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const categoriesRoutes = Router()

const categoriesController = new CategoriesController()

categoriesRoutes.use(ensureAuthenticated)

categoriesRoutes.get("/", categoriesController.index)
categoriesRoutes.post("/", categoriesController.create)
categoriesRoutes.get("/:id", categoriesController.show)
categoriesRoutes.delete("/:id", categoriesController.delete)

module.exports = categoriesRoutes

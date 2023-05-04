const { Router } = require("express")

const FoodsController = require("../controllers/FoodsController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const foodsRoutes = Router()

const foodsController = new FoodsController()

foodsRoutes.use(ensureAuthenticated)

foodsRoutes.get("/", foodsController.index)
foodsRoutes.post("/", foodsController.create)
foodsRoutes.get("/:id", foodsController.showDetails)
foodsRoutes.delete("/:id", foodsController.delete)
foodsRoutes.put("/:id", foodsController.update)

module.exports = foodsRoutes

const { Router } = require("express")

const FoodsController = require("../controllers/FoodsController")
const foodsRoutes = Router()

const foodsController = new FoodsController()

foodsRoutes.post("/:author_id", foodsController.create)

module.exports = foodsRoutes

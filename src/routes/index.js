const { Router } = require("express")

const usersRoutes = require("./users.routes")
const foodsRoutes = require("./foods.routes")
const categoriesRoutes = require("./categories.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/foods", foodsRoutes)
routes.use("/categories", categoriesRoutes)

module.exports = routes

const { Router } = require("express")

const usersRoutes = require("./users.routes")
const foodsRoutes = require("./foods.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/foods", foodsRoutes)

module.exports = routes

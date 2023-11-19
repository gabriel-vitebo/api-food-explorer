const { Router } = require("express");

const usersRoutes = require("./users.routes");
const foodsRoutes = require("./foods.routes");
const categoriesRoutes = require("./categories.routes");
const sessionsRoutes = require("./sessions.routes");
const favoritesRoutes = require("./favorites.routes");
const ingredientsRoutes = require("./ingredients.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/foods", foodsRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/ingredients", ingredientsRoutes);

module.exports = routes;

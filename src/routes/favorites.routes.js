const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.post("/", favoritesController.adding);
favoritesRoutes.delete("/:food_id", favoritesController.delete);
favoritesRoutes.get("/:id", favoritesController.show);

module.exports = favoritesRoutes;

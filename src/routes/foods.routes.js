const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const FoodsController = require("../controllers/FoodsController")
const FoodImageController = require("../controllers/FoodImageController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const foodsRoutes = Router()

const foodsController = new FoodsController()
const foodImageController = new FoodImageController()

const upload = multer(uploadConfig.MULTER)

foodsRoutes.use(ensureAuthenticated)

foodsRoutes.get("/", foodsController.index)
foodsRoutes.post("/", foodsController.create)
foodsRoutes.get("/:id", foodsController.showDetails)
foodsRoutes.delete("/:id", foodsController.delete)
foodsRoutes.put("/:id", foodsController.update)
foodsRoutes.patch(
  "/image/:id",
  upload.single("image"),
  foodImageController.update
)

module.exports = foodsRoutes

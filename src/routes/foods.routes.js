const { Router } = require("express")
const multer = require('multer')
const uploadConfig = require("../configs/upload")

const FoodsController = require("../controllers/FoodsController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const foodsRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const foodsController = new FoodsController()


foodsRoutes.use(ensureAuthenticated)

foodsRoutes.get("/", foodsController.index)
foodsRoutes.post("/", upload.single("image"), foodsController.create)
foodsRoutes.get("/:id", foodsController.showDetails)
foodsRoutes.delete("/:id", foodsController.delete)
foodsRoutes.put("/:id", foodsController.update)

module.exports = foodsRoutes

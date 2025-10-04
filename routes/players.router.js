import {Router} from "express"
import {findAll, findOne, createOne, deleteOne, updateOne, filterAll} from "../controllers/players.controller.js"

const PlayersRouter = Router()

PlayersRouter.get("/search", filterAll)
PlayersRouter.get("/", findAll)
PlayersRouter.get("/:id", findOne)
PlayersRouter.put("/:id", updateOne)
PlayersRouter.post("/", createOne)
PlayersRouter.delete("/id", deleteOne)

export default PlayersRouter
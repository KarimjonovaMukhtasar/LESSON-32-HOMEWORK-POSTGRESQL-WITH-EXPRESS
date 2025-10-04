import {Router} from "express"
import {findAll, findOne, createOne, deleteOne, updateOne, filterAll} from "../controllers/tournaments.controller.js"

const TournamentsRouter = Router()

TournamentsRouter.get("/search", filterAll)
TournamentsRouter.get("/", findAll)
TournamentsRouter.get("/:id", findOne)
TournamentsRouter.put("/:id", updateOne)
TournamentsRouter.post("/", createOne)
TournamentsRouter.delete("/:id", deleteOne)

export default TournamentsRouter
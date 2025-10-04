import {Router} from "express"
import {findAll, findOne, createOne, deleteOne, updateOne, filterAll} from "../controllers/tournament_groups.controller.js"

const TournamentGroupsRouter = Router()

TournamentGroupsRouter.get("/search", filterAll)
TournamentGroupsRouter.get("/", findAll)
TournamentGroupsRouter.get("/:id", findOne)
TournamentGroupsRouter.put("/:id", updateOne)
TournamentGroupsRouter.post("/", createOne)
TournamentGroupsRouter.delete("/id", deleteOne)

export default {TournamentGroupsRouter}
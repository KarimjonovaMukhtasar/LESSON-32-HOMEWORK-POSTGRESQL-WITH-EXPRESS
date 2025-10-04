import {Router} from "express"
// import {FootballClubsRouter} from "./routes/football_clubs.router.js"
import {findAll, findOne, updateOne, createOne, deleteOne, filterAll} from "../controllers/football_clubs.controller.js"
const FootballClubsRouter = Router()

FootballClubsRouter.get("/search", filterAll)
FootballClubsRouter.get("/", findAll)
FootballClubsRouter.get("/:id", findOne)
FootballClubsRouter.put("/:id", updateOne)
FootballClubsRouter.post("/", createOne)
FootballClubsRouter.delete("/:id", deleteOne)

export default {FootballClubsRouter}
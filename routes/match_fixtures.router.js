import {Router} from "express"
import {findAll, findOne, updateOne, createOne, deleteOne, filterAll} from "../controllers/match_fixtures.controller.js"
// import {MatchFixturesRouter} from "./routes/match_fixtures.router.js"
const MatchFixturesRouter = Router()

MatchFixturesRouter.get("/search", filterAll)
MatchFixturesRouter.get("/", findAll)
MatchFixturesRouter.get("/:id", findOne)
MatchFixturesRouter.post("/", createOne)
MatchFixturesRouter.put("/:id", updateOne)
MatchFixturesRouter.delete("/:id", deleteOne)

export default {MatchFixturesRouter}
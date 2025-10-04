import {Router} from "express"
import {findAll, findOne, createOne, deleteOne, updateOne, filterAll} from "../controllers/teams.controller.js"

const TeamsRouter = Router()

TeamsRouter.get("/search", filterAll)
TeamsRouter.get("/", findAll)
TeamsRouter.get("/:id", findOne)
TeamsRouter.put("/:id", updateOne)
TeamsRouter.post("/", createOne)
TeamsRouter.delete("/id", deleteOne)

export default TeamsRouter
import express from "express"
import dotenv from "dotenv"
import {TournamentsRouter} from ".routes/tournaments.router.js"
import {PlayersRouter} from "./routes/players.router.js"
import {TournamentGroupsRouter} from "./routes/tournament_groups.router.js"
import {MatchFixturesRouter} from "./routes/match_fixtures.router.js"
import {FootballClubsRouter} from "./routes/football_clubs.router.js"
import {TeamsRouter} from "./routes/teams.router.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.use("/tournaments", TournamentsRouter)
app.use("/players", PlayersRouter)
app.use("/tournament-groups", TournamentGroupsRouter)
app.use("/match-fixtures", MatchFixturesRouter)
app.use("/football-clubs", FootballClubsRouter)
app.use("/teams", TeamsRouter)
const PORT = process.env.PORT || 3000
app.use(PORT, ()=>{
    console.log(`THE SERVER IS RUNNING SUCCESSFULLY ON THE PORT: ${PORT}`)
})
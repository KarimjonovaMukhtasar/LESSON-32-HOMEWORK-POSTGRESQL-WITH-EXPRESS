import client from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from match_fixtures`
        const allFeatures = await client.query(query)
        console.log(allFeatures.rows)
        return res.status(200).json({
            message: `Successfully retrieved all match fixtures info!`,
            Fixtures: allFeatures.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: "ERROR IN THE SERVER",
            error: error.message
        })
    }
}
const findOne = async (req, res) => {
    try {
        const { id } = req.params
        const query = `Select * from match_fixtures where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            fixtures: searchedId.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: "ERROR IN THE SERVER",
            error: error.message
        })
    }
}
const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const fields = []
        const values = []
        let idx = 1
        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key}=$${idx}`)
            values.push(value)
            idx++
        }
        values.push(req.params.id)
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a fixture!` })
        }
        const query = `Update match_fixtures set ${fields.join(", ")} where id = $${idx} returning *`
        const updatedFixture = await client.query(query, values)
        if (updatedFixture.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an post ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a fixture`,
            post: updatedFixture.rows[0]
        })
    }
    catch (error) {
        console.log(error)
        return res.status(501).json({
            message: `SERVER ERROR!`,
            error: error.message
        })
    }
}
const createOne = async (req, res) => {
    try {
        const { match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status } = req.body
        if (match_date && venue && home_team_id && away_team_id && home_score && away_score && tournament_id && match_status){
            const homeId = await client.query(`Select * from teams where id = $1`, [home_team_id])
            if (homeId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a Home team Id!`,
                    id: home_team_id
                })
            }
            const awayId = await client.query(`Select * from teams where id = $1`, [away_team_id])
            if (awayId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such an away team Id!`,
                    id: away_team_id
                })
            }
            const tournamentId = await client.query(`Select * from tournaments where id = $1`, [tournament_id])
            if (tournamentId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a tournament Id!`,
                    id: tournament_id
                })
            }
            const body = [match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status]
            const query = `Insert into posts (match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status) values ($1,$2, $3, $4, $5, $6, $7, $8) returning *`
            const newFixtures = await client.query(query, body)
            console.log(newFixtures.rows[0])
            return res.status(201).json({
                message: `Successfully created a new fixture`,
                Fixtures: newFixtures.rows[0]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `SERVER ERROR!`,
            error: error.message
        })
    }
}
const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const query = `Delete from match_fixtures where id = $1 returning *`
        const deletedFixtures = await client.query(query, [id])
        if (deletedFixtures.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of Match Fixtures` })
        }
        return res.status(200).json({ message: `Successfully deleted Match Fixtures!`, post: deletedFixtures.rows[0] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
const filterAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = "" } = req.query
        if (filter) {
            const offset = (page - 1) * limit
            const values = [`%${filter}%`, offset, limit]
            const query = `Select * from match_fixtures where match_date ilike $1 or venue ilike $1 or match_status ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among match_fixtures`,
                    filter: filter
                })
            }
            return res.status(200).json({
                message:
                    `Successfully found of the filtered search`,
                total: result.rows.length,
                page,
                limit,
                result: result.rows
            })
        }
        else {
            const offset = (page - 1) * limit
            const query = `Select * from match_fixtures offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All match fixtures (no filter)", result: result.rows })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

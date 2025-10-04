import client from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from players`
        const allPlayers = await client.query(query)
        console.log(allPlayers.rows)
        return res.status(200).json({
            message: `Successfully retrieved all players info!`,
            players: allPlayers.rows
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
        const query = `Select * from players where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            player: searchedId.rows[0]
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
        const { full_name, date_of_birth, position, team_id, jersey_number} = req.body
        const fields = []
        const values = []
        if(team_id){
        const teamId = await client.query(`Select * from teams where id = $1`, [team_id])
        if (teamId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a team Id!`,
                id: team_id
            })
        }
        }
        let idx = 1
        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key}=$${idx}`)
            values.push(value)
            idx++
        }
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a player!` })
        }
        values.push(req.params.id)
        const query = `Update players set ${fields.join(", ")} where id = $${idx} returning *`
        const updatedPlayer = await client.query(query, values)
        if (updatedPlayer.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an player ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a payer`,
             player: updatedPlayer.rows[0]
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
        const { full_name, date_of_birth, position, team_id, jersey_number } = req.body
        if (full_name && date_of_birth && position && team_id && jersey_number) {
            const  teamId = await client.query(`Select * from teams where id = $1`, [team_id])
            if (userId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a team Id!`,
                    id: team_id
                })
            }
            const body = [full_name, date_of_birth, position, team_id, jersey_number]
            const query = `Insert into players (full_name, date_of_birth, position, team_id, jersey_number) values ($1,$2, $3, $4, $5) returning *`
            const newPlayer = await client.query(query, body)
            console.log(newPlayer.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Player`,
                player: newPlayer.rows[0]
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
        const query = `Delete from players where id = $1 returning *`
        const deletedPlayer = await client.query(query, [id])
        if (deletedPlayer.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a player` })
        }
        return res.status(200).json({ message: `Successfully deleted a player!`, player: deletedPlayer.rows[0] })
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
            const query = `Select * from players where full_name ilike $1 or position ilike $1 or jersey_number ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among players`,
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
            const query = `Select * from players offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All players (no filter)", result: result.rows })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

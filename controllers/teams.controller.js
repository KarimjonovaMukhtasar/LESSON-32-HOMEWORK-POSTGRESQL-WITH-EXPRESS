import client from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from teams`
        const all = await client.query(query)
        console.log(all.rows)
        return res.status(200).json({
            message: `Successfully retrieved all teams info!`,
            teams: all.rows
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
        const query = `Select * from teams where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            team: searchedId.rows[0]
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
        const { team_name, club_id, group_id, coach_name } = req.body
        const fields = []
        const values = []
        const clubId = await client.query(`Select * from football_clubs where id = $1`, [club_id])
        if (clubId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a club Id!`,
                id: club_id
            })
        }
        const groupId = await client.query(`Select * from tournament_groups where id = $1`, [group_id])
        if (groupId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a group Id!`,
                id: group_id
            })
        }
        let idx = 1
        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key}=$${idx}`)
            values.push(value)
            idx++
        }
        values.push(req.params.id)
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a team!` })
        }
        const query = `Update teams set ${fields.join(", ")} where id = $${idx} returning *`
        const updated = await client.query(query, values)
        if (updated.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an team ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a team`,
            team: updated.rows[0]
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
        const { team_name, club_id, group_id, coach_name } = req.body
        if (team_name && club_id && group_id && coach_name) {
            const clubId = await client.query(`Select * from clubs where id = $1`, [club_id])
            if (clubId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a club Id!`,
                    id: club_id
                })
            }
            const groupId = await client.query(`Select * from tournament_groups where id = $1`, [group_id])
            if (groupId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a group Id!`,
                    id: group_id
                })
            }
            const body = [team_name, club_id, group_id, coach_name]
            const query = `Insert into teams (team_name, club_id, group_id, coach_name) values ($1,$2, $3, $4) returning *`
            const neww= await client.query(query, body)
            console.log(neww.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Team`,
                team: neww.rows[0]
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
        const query = `Delete from teams where id = $1 returning *`
        const deleted = await client.query(query, [id])
        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a team` })
        }
        return res.status(200).json({ message: `Successfully deleted a team!`, team: deleted.rows[0] })
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
            const query = `Select * from teams where team_name ilike $1 or coach_name ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among teams`,
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
            const query = `Select * from teams offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All teams (no filter)", result: result.rows })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

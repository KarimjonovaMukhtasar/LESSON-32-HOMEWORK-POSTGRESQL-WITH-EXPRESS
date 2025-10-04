import  client from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from tournament_groups`
        const all = await client.query(query)
        console.log(all.rows)
        return res.status(200).json({
            message: `Successfully retrieved all tour groups info!`,
            tourGroups: all.rows
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
        const query = `Select * from tournament_groups where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            tourGroup: searchedId.rows[0]
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
        const { group_name, tournament_id } = req.body
        const fields = []
        const values = []
        const tournamentId = await client.query(`Select * from tournaments where id = $1`, [tournament_id])
        if (tournamentId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a tournament Id!`,
                id: tournament_id
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
            return res.status(401).json({ message: `You must update at least one info of a tour group!` })
        }
        const query = `Update  tournament_groups set ${fields.join(", ")} where id = $${idx} returning *`
        const updated = await client.query(query, values)
        if (updated.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an tour group ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a tour group`,
            tourGroup: updated.rows[0]
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
        const { group_name, tournament_id } = req.body
        if (group_name && tournament_id) {
            const tournamentId = await client.query(`Select * from tournaments where id = $1`, [tournament_id])
            if (tournamentId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a tournament Id!`,
                    id: tournament_id
                })
            }
            const body = [group_name, tournament_id]
            const query = `Insert into  tournament_groups (group_name, tournament_id) values ($1,$2) returning *`
            const neww = await client.query(query, body)
            console.log(neww.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Tour Group`,
                tourGroup: neww.rows[0]
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
        const query = `Delete from  tournament_groups where id = $1 returning *`
        const deleted = await client.query(query, [id])
        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a tour group` })
        }
        return res.status(200).json({ message: `Successfully deleted a tour group!`, tourGroup: deleted.rows[0] })
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
            const query = `Select * from  tournament_groups where group_name ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among tour groups`,
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
            const query = `Select * from  tournament_groups offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All tour groups (no filter)", result: result.rows })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

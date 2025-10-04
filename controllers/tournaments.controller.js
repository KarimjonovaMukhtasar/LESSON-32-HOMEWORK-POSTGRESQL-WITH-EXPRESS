import client  from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from tournaments`
        const all = await client.query(query)
        console.log(all.rows)
        return res.status(200).json({
            message: `Successfully retrieved all tours info!`,
            tours: all.rows
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
        const query = `Select * from tournaments where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            tour: searchedId.rows[0]
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
        const {tournament_name, start_date, end_date, status } = req.body
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
            return res.status(401).json({ message: `You must update at least one info of a tour!` })
        }
        const query = `Update  tournaments set ${fields.join(", ")} where id = $${idx} returning *`
        const updated = await client.query(query, values)
        if (updated.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of a tour ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a tour`,
            tour: updated.rows[0]
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
        const { tournament_name, start_date, end_date, status  } = req.body
        if (tournament_name && start_date && end_date && status ) {
            const body = [tournament_name, start_date, end_date, status ]
            const query = `Insert into  tournaments (tournament_name, start_date, end_date, status ) values ($1,$2, $3, $4) returning *`
            const neww = await client.query(query, body)
            console.log(neww.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Tour`,
                tour: neww.rows[0]
            })
        }
        else {
            return res.status(400).json({
                message: "Missing required fields: tournament_name, start_date, end_date, status",
            });}
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
        const query = `Delete from  tournaments where id = $1 returning *`
        const deleted = await client.query(query, [id])
        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a tour` })
        }
        return res.status(200).json({ message: `Successfully deleted a tour!`, tour: deleted.rows[0] })
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
            const query = `Select * from  tournaments where tournament_name ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among tours`,
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
            const query = `Select * from  tournaments offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All tours (no filter)", result: result.rows })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

import client from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from football_clubs`
        const allClubs = await client.query(query)
        console.log(allClubs.rows)
        return res.status(200).json({
            message: `Successfully retrieved all football clubs info!`,
            football_clubs: allClubs.rows
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
        const query = `Select * from football_clubs where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            football_club: searchedId.rows[0]
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
            return res.status(401).json({ message: `You must update at least one info of a football club!` })
        }
        const query = `Update football_clubs set ${fields.join(", ")} where id = $${idx} returning *`
        const updatedClub = await client.query(query, values)
        if (updatedClub.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an club ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a club`,
            club: updatedClub.rows[0]
        })}
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
        const { club_name, city, country, founded_year} = req.body
        if (club_name && city && country && founded_year) {
            const body = [ club_name, city, country, founded_year]
            const query = `Insert into football_clubs ( club_name, city, country, founded_year) values ($1,$2, $3, $4) returning *`
            const newClub = await client.query(query, body)
            console.log(newClub.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Club`,
                club: newClub.rows[0]
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
        const query = `Delete from football_clubs where id = $1 returning *`
        const deletedClub = await client.query(query, [id])
        if (deletedClub.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a club` })
        }
        return res.status(200).json({ message: `Successfully deleted a club!`, club: deletedClub.rows[0] })
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
            const query = `Select * from football_clubs where club_name ilike $1 or city ilike $1 or country ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among football clubs`,
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
            const query = `Select * from football_clubs offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All clubs (no filter)", result: result.rows })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }

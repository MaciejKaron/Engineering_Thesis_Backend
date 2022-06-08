const db = require('../models')
const Tournament = db.tournaments

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset}
}

//Create and Save a new tournament
exports.createTournament = (req, res) => {
//Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }
    //Create tournament
    const tournament = new Tournament({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    })
    //Save tournament
    tournament.save(tournament).then(
        data => {
            res.send(data)
        }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "error while creating the tournament"
        })
    })
}

//Get all tournaments from db
exports.findAllTournaments = (req, res) => {
    const { page, size, title} = req.query
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}
    const { limit, offset } = getPagination(page,size)
    Tournament.paginate(condition, {offset,limit})
        .then(data => {
            res.send({
                totalItems: data.totalDocs,
                tournaments: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page -1,
            })
        })
        .catch(err => {
            res.status(500).send({
            message : err.message || "error while finding all tournaments"
        })
    })
}

//Get a single tournament by id
exports.findOneTournament = (req, res) => {
    const id = req.params.id
    Tournament.findById(id)
        .then(data => {
            if (!data) {
            res.status(404).send({ message: "Not found tournament with id " + id})
            } else {
                res.send(data)
        }
        })
        .catch(err => {
        res.status(500).send({ message: "Error while finding tournament with id= " +id })
    })
}

//Update a tournament by id
exports.updateTournament = (req, res) => {
    if (!req.body) {
    return res.status(400).send({ message: "Data to update can't be empty"})
    }
    const id = req.params.id
    Tournament.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                message: `Can't update tournament with id=${id}`
            })
            } else {
                res.send({ message: "Tournament was updated successfully"})
        }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error updating tournament with id=" +id
        })
    })
}

//Delete a tournament by id
exports.deleteTournament = (req, res) => {
    const id = req.params.id
    Tournament.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                message: `Can't delete tournament with id=${id}`
            })
            } else {
                res.send({ message: "Tournament was deleted successfully"})
        }
        })
        .catch(err => {
            res.status(500).send({
            message: "Couldn't delete tournament with id= " +id
        })
    })
}

//Delete all objects
exports.deleteAllTournaments = (req, res) => {
    Tournament.deleteMany({})
        .then(data => {
            res.send({
            message: `${data.deletedCount} Tournaments were deleted successfully`
        })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Error while removing all tournaments"
        })
    })
}


//Get only published tournaments
exports.findAllPublishedTournaments = (req, res) => {
    const { page, size } = req.query
    const {limit, offset} = getPagination(page, size)
    Tournament.paginate({ published: true }, {offset, limit})
    .then(data => {
        res.send({
            totalItems: data.totalDocs,
            tournaments: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page -1,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

const db = require('../models')
const Match = db.match
const User = require('../models/user.model')
const Tournament = db.tournaments

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset}
}

exports.createMatch = (req, res) => {
    //validate request
    if (!req.body.opponent || !req.body.playerStats || !req.body.map) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }
    const match = new Match({
        tournamentId: req.body.tournamentId,
        player: req.body.player,
        opponent: req.body.opponent,
        playerStats: req.body.playerStats,
        map: req.body.map,
        isWin: req.body.isWin
    })

    match.save(match).then(
        (data) => {
            res.send(data)
        }
    ).catch((err) => {
        res.status(500).send({
            message: err.message || "error while creating the match"
        })
    })

}

exports.findMyAllMatches = (req, res) => {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)
    User.findById(req.params.id)
        .then(user => {
            Match.paginate(req.body.player == user._id, { offset, limit }) 
                .then(data => {
                    res.send({
                        matches: data.docs,
                        totalItems: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page -1
                })
                })
                .catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error while retrieving matches "
                })
            })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error while finding USER matches"
        })
    })
}

exports.thisTournamentMatches = (req, res) => {
    Tournament.findById(req.params.id)
        .then(tournament => {
            Match.find({ tournamentId: tournament._id})
                .then(match => {
                    if (!match) {
                        res.status(404).send({ message: "Not found match with tournamentId " + tournament._id})
                        } else {
                            res.send(match)
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error while finding this tournament matches"
                })
            })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error while finding this tournament matches"
        })
    })
}

exports.clearThisTournamentMatches = (req, res) => {
    Tournament.findById(req.params.id)
        .then(tournament => {
            Match.deleteMany({ tournamentId: tournament._id})
                .then(match => {
                    if (!match) {
                        res.status(404).send({ message: "Not found match with tournamentId " + tournament._id})
                        } else {
                            res.send({ message: `${match.deleteCount} matches were deleted!`})
                    }
                })
                .catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error while deleting this tournament matches"
                })
            })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error while deleting this tournament matches"
        })
    })
}

exports.deleteThisMatch = (req, res) => {
    Match.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
            res.status(404).send({ message: `Can't delete match with id= ${req.params.id}`})
            } else {
                res.send({ message: "Match was deleted successfuly!"})
        }
        })
        .catch(err => {
            res.status(500).send({
            message: "Couldn't delete match with id= " + req.params.id
        })
    })
}
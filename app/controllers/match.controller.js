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
    
    const match = new Match({
        tournamentId: req.body.tournamentId,
        player: req.body.player,
        opponent: req.body.opponent,
        playerStats: req.body.playerStats,
        team: req.body.team,
        enemyTeam: req.body.enemyTeam,
        teamRounds: req.body.teamRounds,
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
    User.findById(req.params.id)
        .then(user => {
            Match.find({ 'player.playerId' : user._id })
                .then(match => {
                    if (!match) {
                    res.status(404).send({ message: "Not found user matches"})
                    } else {
                        res.send(match)
                }
                })
                .catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error while finding this user matches"
                })
            })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error while finding this user matches"
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
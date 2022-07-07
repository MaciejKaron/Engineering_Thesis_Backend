const db = require('../models')
const Team = db.team
const User = require('../models/user.model')

exports.createTeam = (req, res) => {
    const team = new Team({
        name: req.body.name,
        tag: req.body.tag,
        owner: req.body.owner,
        players: req.body.players,
        pendingPlayers: req.body.pendingPlayers,
    })
    team.save(team).then(
        (data) => {
            res.send(data)
            User.findById(req.body.owner)
                .then((user) => {
                user.team.push(data._id)
                return user.save()
            })
        },
        User.updateOne({ _id: req.body.owner }, { $set: { isInTeam: true } })
                        .then((userr) => {
                        })
    ).catch((err) => {
        res.status(500).send({
            message: err.message || "error while creating team"
        })
    })
}

exports.findAllTeams = (req, res) => {
    const { name } = req.query
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {}
    Team.find(condition)
        .then(data => {
        res.send(data)
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error while finding all teams"
        })
    })
}

exports.findOneTeam = (req, res) => {
    const id = req.params.id
    Team.findById(id)
        .then(data => {
            if (!data) {
            res.status(404).send({ message : "Nor found team with id= "+id})
            } else {
                res.send(data)
        }
        })
        .catch(err => {
        res.status(500).send({message : "error while finding team with id= "+id})
    })
}

exports.deleteTeam = (req, res) => {
    const id = req.params.id
    Team.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                message: "Can't delete team with id= "+id
            })
            } else {
                User.findById(data.owner)
                .then((user) => {
                    user.team.pull(data._id)
                    return user.save()
                })
                User.updateOne({ _id: data.owner }, { $set: { isInTeam: false } })
                .then((userr) => {
                })
                res.send({ message: "Team was deleted successfully"})
        }
        })
        .catch(err => {
        res.status(500).send({ message: "Couldn't delete team with id= "+id})
    })
}

exports.deleteAllTeams = (req, res) => {
    Team.deleteMany({})
        .then(data => {
            res.send({
            message: `${data.deletedCount} Teams were deleted`
        })
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Error while removing all teams"
        })
    })
}

exports.addToPending = (req, res) => {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    Team.findById(req.body._id)
                        .then((currentTeam) => {
                            if (currentTeam.owner.toString() !== req.params.id) { // jeśli id usera to nie id założyciela teamu 
                            if (!currentTeam.players.includes(req.params.id)) { //jeśli nie ma usera w graczach
                                if (!user.teamInvitations.includes(req.body._id)) { //jeśli user nie dostał wcześniej zaproszenia do teamu
                                    user.teamInvitations.push(req.body._id)
                                    currentTeam.pendingPlayers.push(req.params.id)
                                    res.status(200).send("An invitation was send. User has been added to pending") 
                                    return user.save() && currentTeam.save()
                                } else {
                                    res.status(403).send("You allready send invitation to this user")
                                }
                            } else {
                                res.status(403).send("You allready have this user in team")
                                }
                            } else {
                                res.status(403).send("You can't add yourself")
                            }
                    })
            })
        } catch (err) {
            res.status(500).send(err)
        }
}


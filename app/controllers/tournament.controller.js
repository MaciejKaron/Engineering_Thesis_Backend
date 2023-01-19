const db = require('../models')
const Team = require('../models/team.model')
const User = require('../models/user.model')
const Tournament = db.tournaments

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset}
}
//Create and Save a new tournament
exports.createTournament = (req, res) => {
//Validate request
    if (!req.body.title || !req.body.mode || !req.body.level || !req.body.startTime) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }
    //Create tournament
    const tournament = new Tournament({
        title: req.body.title,
        description: req.body.description,
        mode: req.body.mode,
        level: req.body.level,
        published: req.body.published ? req.body.published : false,
        premium: req.body.premium ? req.body.premium : false,
        startTime: req.body.startTime,
        image: req.body.image,
        slots: req.body.slots,
        players: req.body.players,
        teams: req.body.teams,
        stage: req.body.stage,
    })
    //Save tournament
    tournament.save(tournament).then(
        (data) => {
            res.send(data)
        }
    ).catch((err) => {
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

//Get only published tournaments
exports.findAllPublishedTournaments = (req, res) => {
    const { page, size, title } = req.query
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}  && {published: true}
    const {limit, offset} = getPagination(page, size)
    Tournament.paginate(condition, {offset, limit})
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
          err.message || "Some error occurred while retrieving tournaments."
      });
    });
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


exports.addUserToTournament = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user.faceitVerified == false) {
                        return res.status(403).send({ msg: "Please bind your account with faceit" })
                    } else {
                        if (tournament.players.includes(req.body._id)) {
                            // console.log(req.params.id)
                            // console.log(req.body)
                            return res.status(403).send({ msg: "This user already signed up for this tournament" });
                        }
                        else {
                            if (tournament.players.length >= tournament.slots) {
                                return res.status(403).send({ msg: "All slots are occupied" })
                            } else { 
                            if ((tournament.level == "1-3") && (user.faceitLevel > 3)) {
                                return res.status(403).send({ msg: "Your skill level does not meet the requirements" })
                            } else {
                                if ((tournament.level == "4-7") && (user.faceitLevel < 4 || user.faceitLevel > 7)) {
                                    return res.status(403).send({ msg: "Your skill level does not meet the requirements" })
                                } else {
                                    if ((tournament.level == "8-10") && (user.faceitLevel < 8)) {
                                        return res.status(403).send({ msg: "Your skill level does not meet the requirements" })
                                    } else {

                                        let currentTime = new Date()
                                        if (currentTime > tournament.startTime) {
                                            // console.log(currentTime)
                                            // console.log(tournament.startTime)
                                            return res.status(403).send({ msg: "This tournament has already started" });
                                        }
                                        if (tournament.premium == true) {
                                            if (user.vip == false) {
                                                //  console.log(user.vip) 
                                                return res.status(403).send({ msg: "This user dont have premium" });
                                            } else {
                                                tournament.players.push(req.body._id);
                                                // console.log(req.params.id)
                                                // console.log(req.body)
                                                res.status(200).send({ msg: "Joined the tournament" })
                                                return tournament.save();
                                            }
                                        } else {
                                            tournament.players.push(req.body._id);
                                            // console.log(req.params.id)
                                            // console.log(req.body)
                                            res.status(200).send({ msg: "Joined the tournament" })
                                            return tournament.save();
                                        }
                            
                                        
                                    }
                                }
                            }
                        }
                        } 
                    }
            })
    })
        .catch((err) => res.status(500).json(err));
}

exports.leaveUserFromTournament = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            if (tournament.stage.stage2.includes(req.body._id)) {
                tournament.stage.stage2.pull(req.body._id)
            }
            if (tournament.stage.stage3.includes(req.body._id)) {
                tournament.stage.stage3.pull(req.body._id)
            }
            if (tournament.stage.stage4.includes(req.body._id)) {
                tournament.stage.stage4.pull(req.body._id)
            }
            if (tournament.stage.stage5.includes(req.body._id)) {
                tournament.stage.stage5.pull(req.body._id)
            }
            if (tournament.players.includes(req.body._id)) {
                tournament.players.pull(req.body._id)
                res.status(200).send({msg: "Leaved the tournament"})
                return tournament.save();
            } else {
                return res.status(403).send({ msg: "This user is not registered for this tournament"})
        }
        })
        // .then((savedTournament) => res.json(savedTournament))
    .catch((err) => res.status(500).json(err))
}

exports.addTeamToTournament = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
            Team.findById(user.team)
                .then((team) => {  
                    if (!team) {
                        return res.status(403).send({ msg: "You dont have team" })
                    } else {
                        if (req.body._id !== team.owner.toString()) {
                            return res.status(403).send({ msg: "You must be a team leader" })
                        } else {
                            if (tournament.teams.includes(user.team.toString())) {
                                return res.status(403).send({ msg: "This team already signed up for this tournament" });
                            }
                            else {
                                if ((tournament.level == "1-3") && (team.level >= 4)) {
                                    return res.status(403).send({ msg: "Your team skill level does not meet the requirements" })
                                } else {
                                    if ((tournament.level == "4-7" )&& (team.level < 4 || team.level >= 8)) {
                                        return res.status(403).send({ msg: "Your team skill level does not meet the requirements" })
                                    } else {
                                        if ((tournament.level == "8-10") && (team.level < 8)) {
                                            return res.status(403).send({ msg: "Your team skill level does not meet the requirements" })
                                        } else {
                                            let currentTime = new Date()
                                            if (currentTime > tournament.startTime) {
                                                return res.status(403).send({ msg: "This tournament has already started" });
                                            } else {
                                                User.find({ team: user.team })
                                                    .then(players => {
                                                        const notVerifiedPlayers = []
                                                        for (i = 0; i < players.length; i++) {
                                                            if (players[i].faceitVerified == false) {
                                                                notVerifiedPlayers.push(players[i].username)
                                                            }
                                                        }
                                                        if (notVerifiedPlayers.length > 0) {
                                                            return res.status(403).send({ msg: "One of the players is not verified" + " " + notVerifiedPlayers })
                                                        } else {
                                                            if (players.length < 5) { // players.length < 5
                                                                return res.status(403).send({ msg: "You must have a full team to join (5 players)" })
                                                            } else {

                                    
                                                                if (tournament.premium == true) {
                                                                    User.findById(team.owner)
                                                                        .then((owner) => {
                                                                            if (owner.vip == false) {
                                                                                return res.status(403).send({ msg: "This team leader dont have premium" });
                                                                            } else {
                                                                                tournament.teams.push(user.team);
                                                                                res.status(200).send({ msg: "Joined the tournament" })
                                                                                return tournament.save();
                                                                            }
                                                                        })
                                                                } else {
                                                                    tournament.teams.push(user.team);
                                                                    res.status(200).send({ msg: "Joined the tournament" })
                                                                    return tournament.save();
                                                                }
                                                            }
                                                        }
                                                    })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
                .catch((err) => res.status(500).json(err));
                })
                .catch((err) => res.status(500).json(err));
    })
        .catch((err) => res.status(500).json(err));
}

exports.leaveTeamFromTournament = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            if (tournament.stage.stage2.includes(req.body._id)) {
                tournament.stage.stage2.pull(req.body._id)
            }
            if (tournament.stage.stage3.includes(req.body._id)) {
                tournament.stage.stage3.pull(req.body._id)
            }
            if (tournament.stage.stage4.includes(req.body._id)) {
                tournament.stage.stage4.pull(req.body._id)
            }
            if (tournament.teams.includes(req.body._id)) {
                tournament.teams.pull(req.body._id)
                res.status(200).send({msg: "Leaved the tournament"})
                return tournament.save();
            } else {
                return res.status(403).send({ msg: "This team is not registered for this tournament"})
        }
        })
    .catch((err) => res.status(500).json(err))
}

exports.goToStage2 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (tournament.stage.stage2.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user already is in stage 2" })
                        } else {
                            tournament.stage.stage2.push(req.body._id)
                            res.status(200).send({ msg: "User added to stage 2" })
                            return tournament.save()
                        }
                    }
                })
            Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (tournament.stage.stage2.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This team already is in stage 2"})
                        } else {
                            tournament.stage.stage2.push(req.body._id)
                            res.status(200).send({ msg: "Team added to stage 2" })
                            return tournament.save()
                        }
                }
            })
        })
        .catch((err) => res.status(500).json(err));
}

exports.goToStage3 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (tournament.stage.stage3.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user already is in stage 3" })
                        } else {
                            tournament.stage.stage3.push(req.body._id)
                            res.status(200).send({ msg: "User added to stage 3" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (tournament.stage.stage3.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This team already is in stage 3"})
                        } else {
                            tournament.stage.stage3.push(req.body._id)
                            res.status(200).send({ msg: "Team added to stage 3" })
                            return tournament.save()
                        }
                }
            })
        })
        .catch((err) => res.status(500).json(err));
}

exports.goToStage4 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (tournament.stage.stage4.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user already is in stage 4" })
                        } else {
                            tournament.stage.stage4.push(req.body._id)
                            res.status(200).send({ msg: "User added to stage 4" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (tournament.stage.stage4.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This team already is in stage 4"})
                        } else {
                            tournament.stage.stage4.push(req.body._id)
                            res.status(200).send({ msg: "Team added to stage 4" })
                            return tournament.save()
                        }
                }
            })
        })
        .catch((err) => res.status(500).json(err));
}

exports.goToStage5 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (tournament.stage.stage5.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user already is in stage 5" })
                        } else {
                            tournament.stage.stage5.push(req.body._id)
                            res.status(200).send({ msg: "User added to stage 5" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (tournament.stage.stage5.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This team already is in stage 5"})
                        } else {
                            tournament.stage.stage5.push(req.body._id)
                            res.status(200).send({ msg: "Team added to stage 5" })
                            return tournament.save()
                        }
                }
            })
        })
        .catch((err) => res.status(500).json(err));
}

exports.backToStage4 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (!tournament.stage.stage5.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user is not in stage 5" })
                        } else {
                            tournament.stage.stage5.pull(req.body._id)
                            res.status(200).send({ msg: "User removed from stage 5" })
                            return tournament.save()
                        }
                    }
                })
            Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (!tournament.stage.stage5.includes(req.body._id)) {
                        return res.status(403).send({ msg: "This team is not in stage 5"})
                        } else {
                            tournament.stage.stage5.pull(req.body._id)
                            res.status(200).send({ msg: "Team removed from stage 5" })
                            return tournament.save()
                    }
                }
            })
        })
    .catch((err) => res.status(500).json(err))
}

exports.backToStage3 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (!tournament.stage.stage4.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user is not in stage 4" })
                        } else {
                            tournament.stage.stage4.pull(req.body._id)
                            res.status(200).send({ msg: "User removed from stage 4" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (!tournament.stage.stage4.includes(req.body._id)) {
                        return res.status(403).send({ msg: "This team is not in stage 4"})
                        } else {
                            tournament.stage.stage4.pull(req.body._id)
                            res.status(200).send({ msg: "Team removed from stage 4" })
                            return tournament.save()
                    }
                }
            })
        })
    .catch((err) => res.status(500).json(err))
}

exports.backToStage2 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (!tournament.stage.stage3.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user is not in stage 3" })
                        } else {
                            tournament.stage.stage3.pull(req.body._id)
                            res.status(200).send({ msg: "User removed from stage 3" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (!tournament.stage.stage3.includes(req.body._id)) {
                        return res.status(403).send({ msg: "This team is not in stage 3"})
                        } else {
                            tournament.stage.stage3.pull(req.body._id)
                            res.status(200).send({ msg: "Team removed from stage 3" })
                            return tournament.save()
                    }
                }
            })
        })
    .catch((err) => res.status(500).json(err))
}

exports.backToStage1 = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            User.findById(req.body._id)
                .then((user) => {
                    if (user) {
                        if (!tournament.stage.stage2.includes(req.body._id)) {
                            return res.status(403).send({ msg: "This user is not in stage 2" })
                        } else {
                            tournament.stage.stage2.pull(req.body._id)
                            res.status(200).send({ msg: "User removed from stage 2" })
                            return tournament.save()
                        }
                    }
                })
                Team.findById(req.body._id)
                .then((team) => {
                    if (team) {
                        if (!tournament.stage.stage2.includes(req.body._id)) {
                        return res.status(403).send({ msg: "This team is not in stage 2"})
                        } else {
                            tournament.stage.stage2.pull(req.body._id)
                            res.status(200).send({ msg: "Team removed from stage 2" })
                            return tournament.save()
                    }
                }
            })
        })
    .catch((err) => res.status(500).json(err))
}
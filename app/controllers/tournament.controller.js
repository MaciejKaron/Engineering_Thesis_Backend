const db = require('../models')
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
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }
    //Create tournament
    const tournament = new Tournament({
        title: req.body.title,
        description: req.body.description,
        mode: req.body.mode,
        published: req.body.published ? req.body.published : false,
        premium: req.body.premium ? req.body.premium : false,
        startTime: req.body.startTime,
        players: req.body.players,
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
          err.message || "Some error occurred while retrieving tutorials."
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
        if (tournament.players.includes(req.body._id)) {
            // console.log(req.params.id)
            // console.log(req.body)
        return res.status(400).send({ msg: "This user already signed up for this tournament" });
        }
        else {
            let currentTime = new Date()
            if (currentTime > tournament.startTime) {
                // console.log(currentTime)
                return res.status(400).send({ msg: "This tournament has already started" });
            }
             if (tournament.premium == true) {
                 User.findById(req.body._id)
                     .then((user) => {
                        //  console.log(user)
                         if (user.vip == false) {
                            //  console.log(user.vip) 
                             return res.status(400).send({ msg: "This user dont have premium" });
                         } else {
                            tournament.players.push(req.body._id);
                            // console.log(req.params.id)
                            // console.log(req.body)
                        return tournament.save();  
                         } 
                 })
             } else {
                tournament.players.push(req.body._id);
                // console.log(req.params.id)
                // console.log(req.body)
            return tournament.save();
         }
           
        }
    })
        .catch((err) => res.status(500).json(err));
}

exports.leaveUserFromTournament = (req, res) => {
    Tournament.findById(req.params.id)
        .then((tournament) => {
            if (tournament.players.includes(req.body._id)) {
                tournament.players.pop(req.body._id)
                return tournament.save();
            } else {
                return res.status(400).send({ msg: "This user is not registered for this tournament"})
        }
        })
        // .then((savedTournament) => res.json(savedTournament))
    .catch((err) => res.status(500).json(err))
}

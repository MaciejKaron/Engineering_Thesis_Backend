// CONTROLLER FOR TESTING AUTH
const db = require('../models')
const User = db.user

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content")
}

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.")
}
  
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.")
}
  
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.")
}

//create user
exports.createUser = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      roles: req.body.roles
    })
        user.save(user).then(
            (data) => {
                res.send(data)
            } 
        ).catch((err) => {
            res.status(500).send({
                message: err.message || "error while creating user"
            })
        })
    }

exports.findOneUser = (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(data => {
            if (!data) {
            res.status(404).send({ message: "Not found user with id" + id})
            } else {
                res.send(data)
        }
        })
        .catch(err => {
        res.status(500).send({message: "Error while finding user with id=" + id})
    })
}

exports.findAllUsers = (req, res) => {
    const id = req.query.id
    var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {}
    User.find(condition)
        .then(data => {
        res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error while finding all users"
        })
    })
}

exports.updateUser = (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: "Data to update can't be empty"})
    }
    const id = req.params.id
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
            res.status(404).send({message: `can't update user with id=${id}`})
            } else {
                res.send({ message: "User was updated successfully"})
        }
        })
        .catch(err => {
        res.status(500).send({message: "Error updating user with id= "+id})
    })
}
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

exports.findOneUserByUsername = (req, res) => {
    const username = req.params.id
    User.findOne({username: new RegExp('^'+username+'$', "i")})
    .then(data => {
        if (!data) {
        res.status(404).send({ message: "Not found user with username=" + username})
        } else {
            res.send(data)
    }
    })
    .catch(err => {
    res.status(500).send({message: "Error while finding user with username=" + username})
})
}

// return ["user1","user2","user3" + ids]
exports.findOneUserAndFriends = (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(data => {
            if (!data) {
            res.status(404).send({ message: "Not found user with id" + id})
            } else {
                const length = data.friends.length
                var names = []
                for (i = 0; i < length; i++){
                    User.findById(data.friends[i])
                        .then(data2 => {
                            const { _id, username} = data2
                            names.push({ _id, username })
                            // console.log(names);
                        })
                }
                User.findById(id)
                    .then(doNothink => {
                        res.send(names)
                }) 
        }
        })
        .catch(err => {
        res.status(500).send({message: "Error while finding user with id=" + id})
    })
}



exports.findAllUsers = (req, res) => {
    const {username} = req.query
    var condition =  username ? { username: { $regex: new RegExp(username), $options: "i" } } : {}
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

exports.getAllUsers = (req, res) => {
    User.find({})
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

exports.addToPending = (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    // console.log(user)
                    User.findById(req.body._id)
                        .then((currentUser) => {
                            if (!currentUser.friends.includes(req.params.id)) { //jeśli nie ma w u2 w znajomych
                                // console.log(currentUser)
                                if (!user.invitations.includes(req.body._id)) { //jeśli user2 nie dostał od usera1 wcześniej zaproszenia
                                    user.invitations.push(req.body._id)
                                    currentUser.pendingFriends.push(req.params.id)
                                    res.status(200).send("An invitation was send. User has been added to pending")
                                    return user.save() && currentUser.save()
                                } else {
                                    res.status(403).send("You allready send invitation this user")
                                }
                            } else {
                                res.status(403).send("You allready have this user in friends")
                            }
                        })
                })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(403).send("You cant add yourself")
    }
}

exports.removeFromPending = (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    User.findById(req.body._id)
                    .then((currentUser) => {
                        if (user.invitations.includes(req.body._id)) {
                            user.invitations.pull(req.body._id)
                            currentUser.pendingFriends.pull(req.params.id)
                            res.status(200).send("The invitation was canceled")
                            return user.save() && currentUser.save()
                        } else {
                            res.status(403).send("The invitation has not been sent")
                    }
                })
            })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(403).send("You cant remove yourself")
    }
}

exports.confirmTheInvitation = (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    User.findById(req.body._id)
                        .then((currentUser) => {
                            if (currentUser.invitations.includes(req.params.id)) {
                                currentUser.invitations.pull(req.params.id)
                                currentUser.friends.push(req.params.id)
                                user.pendingFriends.pull(req.body._id)
                                user.friends.push(req.body._id)
                                res.status(200).send("Accepted as a friend")
                                return user.save() && currentUser.save()
                            } else {
                                res.status(403).send("Nobody like that invited you to be friends")
                        }
                    })
            })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(403).send("You cant accept yourself")
    }
}

exports.declineTheInvitation = (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    User.findById(req.body._id)
                    .then((currentUser) => {
                        if (currentUser.invitations.includes(req.params.id)) {
                            currentUser.invitations.pull(req.params.id)
                            user.pendingFriends.pull(req.body._id)
                            res.status(200).send("The invitation was canceled")
                            return user.save() && currentUser.save()
                        } else {
                            res.status(403).send("The invitation has not been sent")
                    }
                })
            })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(403).send("You cant remove yourself")
    }
}

exports.removeFromFriends = (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            User.findById(req.params.id)
                .then((user) => {
                    User.findById(req.body._id)
                        .then((currentUser) => {
                            if (user.friends.includes(req.body._id)) {
                                user.friends.pull(req.body._id)
                                currentUser.friends.pull(req.params.id)
                                res.status(200).send("Successfully removed from friends")
                                return user.save() && currentUser.save()
                            } else {
                                res.status(403).send("Its not your friend")  
                        }
                    })
            })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(403).send("You cant remove yourself from friends")
    }
}

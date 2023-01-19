const db = require('../models')
const ROLES = db.ROLES
const User = db.user

checkDuplicate = (req, res, next) => {
    //username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" })
            return
        }
        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" })
                return
            }
            next()
        })
    })
}

checkRoleExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++){
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({ message: `Failed! Role ${req.body.roles[i]} doesn't exist!` })
                return
            }
        }
    }
    next()
}

badUsername = (req, res, next) => {
    if (req.body.username.length < 3) {
        res.status(400).send({ message: "Failed! Username is too short!" })
        return
    }
    next()
}

badPassword = (req, res, next) => {
    if (req.body.password.length < 6) {
        res.status(400).send({ message: "Failed! Password is too short!" })
        return
    }
    next()
}

badEmail = (req, res, next) => {
    if (req.body.email.length < 10) {
        res.status(400).send({ message: "Email is not valid!" })
        return
    }
    next()
}

const verifySignUp = {
    checkDuplicate,
    checkRoleExisted,
    badUsername,
    badPassword,
    badEmail
}

module.exports = verifySignUp
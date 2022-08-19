const { response } = require('express')
const db = require('../models')
const Notification = db.notification

exports.createNotification = (req, res) => {
    const notification = new Notification(req.body)

    try {
        if (req.body.sender !== "" && req.body.receiver !== "") {
            notification.save(notification).then(
                (data) => {
                    res.send(data)
                }
            ).catch((err) => {
                res.status(500).send({
                    message: err.message || "error while creating notification"
                })
            })
        } else {
            res.status(403).send("sender and receiver are required")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

//get notification by sender Id
exports.getSenderNotification = (req, res) => {
    try {
        Notification.find({ sender: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                res.status(404).send({ message: "Not found notification"})
                } else {
                    res.send(data)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

//get notification by receiver Id
exports.getReceiverNotification = (req, res) => {
    try {
        Notification.find({ receiver: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                res.status(404).send({ message: "Not found notification"})
                } else {
                    res.send(data)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

//get notification by receiver Id and delete 
exports.deleteReceiverNotification = (req, res) => {
    try {
        Notification.findOneAndDelete({ receiver: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                res.status(404).send({ message: "Not found notification"})
                } else {
                    res.send(data)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

//get notification by receiver Id and delete 
exports.deleteSenderNotification = (req, res) => {
    try {
        Notification.findOneAndDelete({ sender: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                res.status(404).send({ message: "Not found notification"})
                } else {
                    res.send(data)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

//get notification by own Id and delete 
exports.deleteNotification = (req, res) => {
    try {
        Notification.findOneAndDelete({ _id: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                res.status(404).send({ message: "Not found notification"})
                } else {
                    res.send(data)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}


const { response } = require('express')
const db = require('../models')
const Conversation = db.conversation

exports.createConversation = (req, res) => {
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    })
    //if this conversation already exist
    Conversation.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } })
        .then(response => {
    if (!response) {
        try {
            conversation.save(conversation).then(
                (data) => {
                    res.send(data)
                }
            ).catch((err) => {
                res.status(500).send({
                    message: err.message || "error while creating conversation"
                })
            })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(200).send("You allready have conversation with this user")
            }
        })
}

//get conversations by user Id
exports.getConversation = (req, res) => {
    try {
        Conversation.find({ members: { $in: [req.params.id] } })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found conversation"})
                    } else {
                        res.send(data)
                }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

//get conversation of two users
exports.getCommonConversation = (req, res) => {
    try {
        Conversation.findOne({ members: { $all: [req.params.id1, req.params.id2] } })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found conversation"})
                    } else {
                        res.send(data)
                }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}
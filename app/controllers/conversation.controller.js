const db = require('../models')
const Conversation = db.conversation

exports.createConversation = (req, res) => {
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    })
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
}

//get conversations by user Id
exports.getConversation = (req, res) => {
    try {
        Conversation.find({ members: { $in: [req.params.id] } })
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

//get conversation of two users
exports.getCommonConversation = (req, res) => {
    try {
        Conversation.findOne({ members: { $all: [req.params.id1, req.params.id2] } })
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
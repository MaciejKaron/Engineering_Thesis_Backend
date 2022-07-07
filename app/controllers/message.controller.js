const db = require('../models')
const Message = db.message

exports.createMessage = (req, res) => {
    const message = new Message(req.body)

    try {
        if (req.body.text !== "") {
            message.save(message).then(
                (data) => {
                    res.send(data)
                }
            ).catch((err) => {
                res.status(500).send({
                    message: err.message || "error while creating message"
                })
            })
        } else {
            res.status(403).send("Text is required")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

// find by conversation Id
exports.getMessage = (req, res) => {
    try {
        Message.find({ conversationId: req.params.id })
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
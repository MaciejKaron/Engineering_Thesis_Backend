const mongoose = require('mongoose')

const Notification = mongoose.model("Notification",
    new mongoose.Schema({
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        senderName: String,
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
        {timestamps: true}
    )
)

module.exports = Notification
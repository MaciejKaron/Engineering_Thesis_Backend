const mongoose = require('mongoose')

const User = mongoose.model("User",
    new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        vip: Boolean,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    }))

    module.exports = User
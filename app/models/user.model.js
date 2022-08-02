const mongoose = require('mongoose')

const User = mongoose.model("User",
    new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        vip: Boolean,
        team: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
            }
        ],
        isInTeam: Boolean,
        teamInviteSend: Boolean,
        teamInvitations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team"
            }
        ],
        invitations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        pendingFriends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    }))

    module.exports = User
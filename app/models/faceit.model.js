const mongoose = require('mongoose')

const FaceitStats = mongoose.model("FaceitStats",
    new mongoose.Schema({
        owner: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        ownerName: String,
        player_id: String,
        nickname: String,
        avatar: String,
        skill_level: Number,
        faceit_elo: Number,
        matches: String,
        kd_ratio: String,
        headshots: String,
        wins: String,
        win_streak: String
    }))

    module.exports = FaceitStats
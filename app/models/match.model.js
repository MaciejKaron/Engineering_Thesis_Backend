const mongoose = require('mongoose')

const Match = mongoose.model("Match",
    new mongoose.Schema({
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament"
        },
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        opponent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        playerStats: {
            kills: String,
            deaths: String,
        },
        map: String,
        isWin: Boolean,
    },
        { timestamps: true }
    )
)

module.exports = Match
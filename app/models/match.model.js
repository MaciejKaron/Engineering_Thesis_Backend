const mongoose = require('mongoose')

const Match = mongoose.model("Match",
    new mongoose.Schema({
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament"
        },
        player: {
            playerId: mongoose.Schema.Types.ObjectId,
            playerUsername: String
        },
        opponent: {
            opponentId: mongoose.Schema.Types.ObjectId,
            opponentUsername: String
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
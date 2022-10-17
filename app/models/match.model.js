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
        team: {
            teamId: mongoose.Schema.Types.ObjectId,
            teamName: String
        },
        enemyTeam: {
            enemyTeamId: mongoose.Schema.Types.ObjectId,
            enemyTeamName: String
        },
        teamRounds: {
            roundsWin: String,
            roundsLose: String
        },
        map: String,
        isWin: Boolean,
    },
        { timestamps: true }
    )
)

module.exports = Match
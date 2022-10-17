const controller = require('../controllers/match.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
    app.post("/api/match", controller.createMatch)

    app.get("/api/matches/user/:id", controller.findMyAllMatches)

    app.get("/api/matches/tournament/:id", controller.thisTournamentMatches)

    app.delete("/api/matches/delete/:id", controller.clearThisTournamentMatches)

    app.delete("/api/match/delete/this/:id", controller.deleteThisMatch)
}
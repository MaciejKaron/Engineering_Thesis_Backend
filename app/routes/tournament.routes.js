const controller = require('../controllers/tournament.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
    app.post("/api/tournaments", controller.createTournament)
    
    app.get("/api/tournaments/all", controller.findAllTournaments)

    app.get("/api/tournaments/published", controller.findAllPublishedTournaments)

    app.get("/api/tournaments/:id", controller.findOneTournament)

    app.put("/api/tournaments/:id", controller.updateTournament)

    app.delete("/api/tournaments/:id", controller.deleteTournament)

    app.delete("/api/tournaments/delete/all", controller.deleteAllTournaments)

    app.post("/api/tournaments/join/:id", controller.addUserToTournament)

    app.post("/api/tournaments/rejoin/:id", controller.leaveUserFromTournament)
}
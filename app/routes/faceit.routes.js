const controller = require('../controllers/faceit.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
    app.get('/api/faceit/stats/:id', controller.getMyFaceitStats)
    app.get('/api/faceit/game/stats/:id', controller.getGameStats)
    app.post('/api/faceit/all/stats/:id', controller.getMyAllFaceitStats)
    app.get('/api/faceit/stats/find/:id', controller.findOneStats)
    app.get('/api/faceit/verified', controller.getVerifiedUsers)
    app.get('/api/faceit/ranking', controller.getRankingStats)
}
const { authJwt } = require('../middleware')
const controller = require('../controllers/team.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post('/api/team', controller.createTeam)
    app.get('/api/team/:id', controller.findOneTeam)
    app.get('/api/team/find/all', controller.findAllTeams)
    app.delete('/api/team/:id', controller.deleteTeam)
    app.delete('/api/team/delete/all', controller.deleteAllTeams)
}
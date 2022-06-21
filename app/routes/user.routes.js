const { authJwt } = require('../middleware')
const controller = require('../controllers/user.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
    app.get('/api/test/all', controller.allAccess)
    app.get('/api/test/user', [authJwt.verifyToken], controller.userBoard)
    app.get('/api/test/mod', [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard)
    app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)

    app.post('/api/user', controller.createUser)
    app.get('/api/user/:id', controller.findOneUser)
    app.get('/api/user/find/all', controller.findAllUsers)
    app.put('/api/user/:id', controller.updateUser)
    app.post('/api/user/friend/:id', controller.addToPending)
    app.post('/api/user/unfriend/:id', controller.removeFromFriends)
    app.post('/api/user/remove/:id', controller.removeFromPending)
    app.post('/api/user/accept/:id', controller.confirmTheInvitation)
    app.post('/api/user/decline/:id', controller.declineTheInvitation)
}
const { authJwt } = require('../middleware')
const controller = require('../controllers/conversation.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post('/api/conversation', controller.createConversation)
    app.get('/api/conversation/:id', controller.getConversation)
    app.get('/api/conversation/:id1/:id2', controller.getCommonConversation)
    
}
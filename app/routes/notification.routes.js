const controller = require('../controllers/notification.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post('/api/notification', controller.createNotification)
    app.get('/api/notification/sender/:id', controller.getSenderNotification)
    app.get('/api/notification/receiver/:id', controller.getReceiverNotification)
    app.post('/api/notification/receiver/delete/:id', controller.deleteReceiverNotification)
    app.post('/api/notification/sender/delete/:id', controller.deleteSenderNotification)
    app.post('/api/notification/delete/:id', controller.deleteNotification)
    
}
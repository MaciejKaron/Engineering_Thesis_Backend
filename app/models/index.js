//INITIALIZE MONGOOSE
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.user = require('./user.model')
db.role = require('./role.model')
db.ROLES = ["user", "moderator", "admin"]
db.tournaments = require('./tournament.model')(mongoose, mongoosePaginate)
db.refreshToken = require('./refreshToken.model')
db.team = require('./team.model')
db.conversation = require('./conversation.model')
db.message = require('./message.model')

module.exports = db


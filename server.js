const express = require('express')
const cors = require('cors')
const dbConfig = require("./app/config/db.config")
const app = express()
const io = require("socket.io")(8090, {
    cors: {
        origins: ['http://localhost:8081']
    }
})
var corsOptions = {
    origin: "http://localhost:8081"
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require("./app/models")
const Role = db.role

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Successfully connect to MongoDB")
        initial()
    })
    .catch(err => {
        console.error("Connection error", err)
        process.exit()
})

//ROUTES
app.get("/", (req, res) => {
    res.json({ message: "Welcome in my app!" })
})

app.get("/cipajebanazżółkłacipa", (req, res) => {
    res.json({ message: "Zżółkła cipa" })
})

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/tournament.routes')(app)
require('./app/routes/team.routes')(app)
require('./app/routes/conversation.routes')(app)
require('./app/routes/message.routes')(app)


//set PORT
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
//all ONLINE users
let users = []

const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId })
    }
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}
// userId --> senderId
const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}
//when connected
io.on("connection", (socket) => {
    console.log("a user connected")
    //take userId and socketId from currentUser
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

//send and get messages
    socket.on("sendMessage", ({ senderId, receiverId, text , createdAt}) => {
        const user = getUser(receiverId)
        if (user !== undefined) {
            io.to(user.socketId).emit("getMessage", {
                senderId: senderId,
                text: text,
                createdAt: createdAt
            })
        } else {
            console.log('This user is offline')
        }
    })     

//when disconnected
    socket.on("disconnect", () => {
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'user' to roles collection")
            })
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'moderator' to roles collection")
            })
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'admin' to roles collection")
            })
        }
    })
}
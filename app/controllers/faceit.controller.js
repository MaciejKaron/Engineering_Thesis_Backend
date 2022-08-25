const db = require('../models')
const FaceitStats = db.faceitStats
const User = db.user

const Faceit = require("faceit-js")
const api = new Faceit(`6e028b05-fb8c-45dc-8d8e-c60d6e0d8eab`)

//user informations from api
exports.getMyFaceitStats = (req, res) => {
   const id = req.params.id
   User.findById(id)
      .then(user => {
         let currentUser = api.nickname(user.faceitNickname)
            .then(curUser => {
         if (!currentUser) {
            res.status(400).send({message: "Could not find nickname!"})
         } else {
            User.updateOne({ _id: req.params.id }, { $set: { faceitVerified: true } })
               .then(() => {
            })
            res.send(curUser)
         }
      })
   })
}

//user game stats from api
exports.getGameStats = (req, res) => {
   const id = req.params.id
   User.findById(id)
      .then(user => {
         let currentUser = api.nickname(user.faceitNickname)
            .then(curUser => {
               if (!currentUser) {
                  res.status(400).send({message: "Could not find nickname!"})
               } else {
                  let currentUserStats = api.players(curUser.player_id, "stats", "csgo")
                  .then(curUserStats => {
                     if (!currentUserStats) {
                        res.status(400).send({ message: "Could not find stats" })
                     } else {
                        res.send(curUserStats)
                     }
               })  
            }
         })
   })
}

//creata and bind stats with user
exports.getMyAllFaceitStats = (req, res) => {
   const id = req.params.id
   User.findById(id)
       .then(user => {
           if (!user) {
           res.status(404).send({ message: "Not found user with id" + id})
           } else {
              let currentUser = api.nickname(user.faceitNickname)
                 .then(curUser => {
                    if (!currentUser) {
                       res.status(400).send({ message: "Could not find nickname!" })
                    } else {
                       let currentUserStats = api.players(curUser.player_id, "stats", "csgo")
                       .then(curUserStats => {
                          if (!currentUserStats) {
                             res.status(400).send({ message: "Could not find stats" })
                          } else {
                       
                             const faceitStats = new FaceitStats({
                                owner: user._id,
                                ownerName: user.username,
                                player_id: curUser.player_id,
                                nickname: curUser.nickname,
                                avatar: curUser.avatar,
                                  skill_level: curUser.games.csgo.skill_level,
                                  faceit_elo: curUser.games.csgo.faceit_elo,
                                  matches: curUserStats.lifetime.Matches,
                                  kd_ratio: curUserStats.lifetime["Average K/D Ratio"],
                                  headshots: curUserStats.lifetime["Average Headshots %"],
                                  wins: curUserStats.lifetime.Wins,
                                  win_streak: curUserStats.lifetime["Longest Win Streak"]
                             })
                             faceitStats.save(faceitStats).then(
                                (data) => {
                                   res.send(data)
                                   User.updateOne({ _id: req.params.id }, { $set: { faceitVerified: true } })
                                      .then(() => {
                                      })
                                }
                             )
                          }
                     }) //stats
                    }
            }) //curUser
       }
       })// user
       .catch(err => {
       res.status(500).send({message: err.message || "Error while finding user with id=" + id})
   })
}

//find by owner id
exports.findOneStats = (req, res) => {
   const id = req.params.id
   User.findById(id)
       .then(user => {
         
         FaceitStats.find({owner : user._id})
         .then(data => {
            if (!data) {
            res.status(404).send({ message : "Nor found stats with id= "+id})
            } else {
               res.send(data)
         }
         })
         .catch(err => {
            res.status(500).send({message : "error while finding team with id= "+id})
        })
          
       })
}

//get verified users
exports.getVerifiedUsers = (req, res) => {
   User.find({ faceitVerified: true })
      .then(data => {
            res.send(data)
      })
      .catch(err => {
         res.status(500).send({
             message:
             err.message || "Some error while finding all users"
     })
 })
}

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            published: Boolean
        },
        { timestamps: true}
    )

    schema.plugin(mongoosePaginate)

    const Tournament = mongoose.model("Tournament", schema)
    return Tournament
}

// const Tournament = mongoose.model("Tournament",
//     new mongoose.Schema({
//         title: String,
//         description: String,
//         published: Boolean,
//     },
//         { timestamps: true }
//     ))

//     module.exports = Tournament
const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    storyId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    text : { 
        type : String,
        required : true
    },
    authorId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }, // user
    order : { 
        type : Number,
        required : true
    } // use to preserve the order of comments for a video
},{timestamps : true});

module.exports = mongoose.model('Comment',CommentSchema);
const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    storyId: {
      type : mongoose.Schema.Types.ObjectId,
      required : true
    },
    userId:{
      type : mongoose.Schema.Types.ObjectId, // user who reacted to story
      required : true
    } ,
    reactionType: {
      type :  String,
      enum : ['upvote','downvote','comment'],
      required : true
    } // upvote , downvote , comment
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reaction", ReactionSchema);

const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      min : 0,
      default: 0,
    },
    downvotes: {
      type: Number,
      min : 0,
      default: 0,
    },
    comments : {
      type: Number,
      min : 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);

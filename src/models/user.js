const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = mongoose.Schema;

const usersSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true
    },

    profile: {
      type: String,
      required: true
    },
    verify: {
      type: Boolean,
      default: false
    },
    created: {
      type: Date,
      default: Date.now
    }
  }
);

const User = mongoose.model('User', usersSchema);
module.exports = User;
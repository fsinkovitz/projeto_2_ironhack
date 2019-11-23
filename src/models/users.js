const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = mongoose.Schema;

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      unique: true
    },

    profile: {
      type: String,
      required: true,
      unique: true 
    },

    created: {
      type: Date,
      default: Date.now
    }
  }
);

const User = mongoose.model('User', usersSchema);
module.exports = User;
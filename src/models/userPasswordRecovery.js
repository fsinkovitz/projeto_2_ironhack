const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRecoverySchema = new Schema(
  {
    userId: {
      type: String,
      unique: true
    }
  }
);

const Recovery = mongoose.model('Recovery', booksSchema);
module.exports = Recovery;
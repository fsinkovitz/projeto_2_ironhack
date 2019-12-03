const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userVerificationSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true
    }
  }
);

const Verification = mongoose.model('Verification', booksSchema);
module.exports = Verification;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      unique: true
    },

    cardExpirationDate: {
      type: String,
      required: true,
      unique: true
    },

    cardCvv: {
      type: String,
      required: true,
      unique: true
    },

    userName: {
      type: String,
      required: true,
      unique: true
    },
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    cardNumber: {
      type: String,
      required: true,
    },

    cardExpirationDate: {
      type: String,
      required: true,
    },

    cardCvv: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },
    price: {
      type: String
    },

    titleBook: {
      type: String
    },

    bookId: {
      type: String,
    }
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
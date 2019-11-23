const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    cardnumber: {
      type: String,
      required: true
    },

    cardexpirationdate: {
      type: String,
      required: true
    },

    cardcvv: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true
    },
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
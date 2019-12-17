const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: {
      type: String
    },

    gender: {
      type: String
    },

    author: {
      type: String
    },

    price: {
      type: Number
      required: true
    },

    description: {
      type: String
    },
    value: {
      type: Number
    },

    cover: {
      type: String
    },

    qunatity: {
      type: Number
    },

    imgName: {
      type: String
    },

    publishCompany: {
      type: String
    },

    vendorId: {
      type: String
    }
  }
);

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
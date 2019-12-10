const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: {
      type: String,
     // required: true
    },

    gender: {
      type: String
    },

    author: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },

    cover: {
      type: String,
      // required: true
    },

    publishCompany: {
      type: String
    }
  }
);

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: {
      type: String,
    },

    gender: {
      type: String
    },

    author: {
      type: String
    },

    publishcompany: {
      type: String
    },

    descriprion: {
      type: String
    },

    value: {
      type: Number,
    },

    cover: {
      type: String,
    },

    qunatity: {
      type: Number,
    },

    comments: {
      type: String
    }
  }
);

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
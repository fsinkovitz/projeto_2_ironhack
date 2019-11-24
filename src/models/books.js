const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
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
      required: true
    },

    cover: {
      type: String,
      required: true
    },

    qunatity: {
      type: Number,
      required: true
    },

    comments: {
      type: String
    }
  }
);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },

    descriprion: {
      type: String,
    },

    value: {
      type: Number,
      required: true
    },

    cover: {
      type: String,
      required: true
    },

    qunatity: {
      type: Number,
      required: true
    }
  }
);

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
const express = require('express');
const addBooks = express.Router();
const Book = require('../models/books.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

addBooks.get('/addBooks', (req, res, next) => {
    res.render('addBooks');
  });

addBooks.post('/addBooks', (req, res, next) => {
  const title = req.body,title;
  const gender = req.body.gender;
  const author = req.body.author;
  const coust = req.body.coust;
  const description = req.body.description;
  const company = req.body.publishCompany;
})

Book.create({title, gender, author, coust, description, company})
  .then((newBook) => {
    console.log(newBook);
    console.log('Book created');
    res.redirect('/listbooksSell');
  })
  .catch(error => {
    console.log(console.log('Error: ', erro));
  });
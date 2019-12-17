const express = require('express');
const router = express.Router();
const Book = require('../models/books.js');
const bodyParser = require('body-parser');
const uploadCloud = require('./cloundinary');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

router.get('/addBooks', (req, res, next) => {
  res.render('addBooks');
});

router.post('/addBooks', uploadCloud.single('cover'), (req, res, next) => {
  console.log('test')
  const { user } = request.session;
  const theTitle = request.body.title;
  const gender = request.body.gender;
  const theAuthor = request.body.author;
  const price = request.body.price;
  const description = request.body.description;
  const cover = request.body.cover;
  const publishCompany = request.body.publishCompany;
  const vendorId = user._id; // '5debf395c949103c80cd9240'

  const newBook = new Book({  title: theTitle, gender: gender, author: theAuthor, price: price, description: description, cover: cover, publishCompany: publishCompany, vendorId: vendorId })
  newBook.save()
    .then((book) => {
      console.log(JSON.stringify(newBook));
      console.log('Book created');
      res.redirect('/listbooksSell');
    })
    .catch(error => {
      console.log(error);
    });

})
module.exports = router;
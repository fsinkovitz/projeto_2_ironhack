const express = require('express');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const router = express.Router();
const Book = require('../models/books.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'ironbooks', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

router.get('/addBooks', (req, res, next) => {
  res.render('addBooks');
});

router.post('/addBooks', storage.single('photo'), (req, res, next) => {
  const title = req.body.title;
  const gender = req.body.gender;
  const author = req.body.author;
  const coust = req.body.coust;
  const description = req.body.description;
  const company = req.body.publishCompany;

  Book.create({
      title,
      gender,
      author,
      coust,
      description,
      company
    })
    .then((newBook) => {
      console.log(newBook);
      console.log('Book created');
      res.redirect('/listbooksSell');
    })
    .catch(error => {
      console.log(console.log('Error: ', error));
    });

})
module.exports = router;
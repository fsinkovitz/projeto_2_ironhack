const express = require('express');
const router = express.Router();
const User = require('../Models/user.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const nodemailer = require('nodemailer');


router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});


//Signup
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;
  const profile = req.body.profile;
  const message = req.body.message;


  if (username === '' || password === '' || profile === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a user name, email, profile and a password to sign up',
    });
    return;
  }
  if (password !== confirmPassword) {
    res.render('auth/signup', {
      errorMessage: 'The password and confirmation are not the same',
    });
    return;
  }


  User.findOne({ 'username': username, 'email': email })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!',
        });
        return;
      }
      else if (email !== null) {
        res.render('auth/signup', {
          errorMessage: 'The email already exists in other account!',
        });
        return;
      }
    })
    .catch(error => {
      next(error);
    });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  User.create({ userName: username, email, password: hashPass, profile })
    .then((newUser) => {
      console.log(newUser);
      console.log('User created. ' + newUser.username + ' pass: ' + newUser.hashPass);
      res.redirect('/');
    })
    .catch(error => {
      console.log(console.log('An error happened: ', error));
    });

    
  //send mail
  let subject = 'Assunto do email';
  res.render('message', { email, subject, message })

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'cristianjesushh@gmail.com',
      pass: 'Bolinha11@'
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email,
    subject: subject,
    text: message,
    html: `<b>${message}</b>`
  })
    .then(info => res.render('message', { email, subject, message, info }))
    .catch(error => console.log(error));





});


//Login
router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({ 'username': theUsername })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: `The username doesn't exist.`,
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session = user;
        res.redirect('/');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password',
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;

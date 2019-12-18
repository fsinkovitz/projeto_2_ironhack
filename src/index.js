require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./routes/auth.js');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../../public'));
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require('hbs');
const axios = require('axios').default;
const Book = require('../src/models/books');
const User = require('./models/user');
const Payment = require('./models/payment')
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const data = require('../src/models/data');
const uploadCloud = require('./config/cloudnary');

// DEV mongoose.connect('mongodb://heroku_b6z2mw6l:1djmt1m9tm8sm1kr2hvabeco79@ds351628.mlab.com:51628/heroku_b6z2mw6l', { useNewUrlParser: true })
//mongoose.connect('mongodb://heroku_l3rp0s5l:ocedsjema6l0lq5utsgja79gvv@ds141661.mlab.com:41661/heroku_l3rp0s5l', { useNewUrlParser: true })
mongoose.connect('mongodb+srv://jesus:F4iC0I35R5snjcIs@cluster0-3dz7l.azure.mongodb.net/ironbook-users?retryWrites=true&w=majority', {
  useNewUrlParser: true
})
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../../public'));

app.use(session({
  secret: 'ironbook-auth-secret',
  cookie: {
    maxAge: 600000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

app.use(router);

app.use(['/', '/home'], require('./routes/home'));


// Retorna a lista dos livros do vendedor logadoo.
app.get('/listbooksSell', (request, response) => {
  const {
    user
  } = request.session;
  Book.find({
    'vendorId': user._id
  })
    .then(bookFromDB => {
      response.render('listbooksSell', {
        books: bookFromDB,
        user
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    })
});



// **********  A D D   --- B O O K S  ***********//
app.get('/addBooks', (request, response) => {
  const {
    user
  } = request.session;
  const userMessage = `${user.userName}. You do not have the seller profile. Please update your profile.`
  if (user.profile === "1") {
    response.render('addBooks', {
      user
    });
  } else {
    response.render('userMessage', {
      userMessage,
      user
    });
  }
});

app.post('/addBooks', uploadCloud.single("cover"), (request, response, next) => {
  const {
    user
  } = request.session;
  const theTitle = request.body.title;
  const gender = request.body.gender;
  const theAuthor = request.body.author;
  const price = request.body.price;
  const description = request.body.description;
  const publishCompany = request.body.publishCompany;
  const cover = request.file.url;
  const imgName = request.file.originalname;
  const vendorId = user._id;

  if (theTitle === '' || gender === '' || theAuthor === "" || price === "" || description === "" || cover === "" || publishCompany === "") {
    response.render('addBooks', {
      errorMessage: 'Please, indicate all informations to add the book',
    });
    return;
  }

  Book.findOne({
    'title': theTitle,
    'author': theAuthor
  })
    .then(book => {
      if (book !== null) {
        response.render('addBooks', {
          errorMessage: 'The title already exists!',
        });
        return;
      } else {
        const newBook = new Book({
          title: theTitle,
          gender: gender,
          author: theAuthor,
          price: price,
          description: description,
          cover: cover,
          publishCompany: publishCompany,
          vendorId: vendorId,
          imgName: imgName
        })
        newBook.save()
          .then((book) => {
            console.log('New book add   ', JSON.stringify(newBook));
            console.log('Book created');
            response.render('addBookMessage', {
              newBook,
              user
            });
          })
          .catch(error => {
            console.log('Error: ', error);
          });
      }
    });
});
// **********  E N D  --  A D D   --- B O O K S  ***********//

// ********** E D I T --  B O O K S  ***********//
app.get('/editbooks/:id', (request, response, next) => {
  const {
    user
  } = request.session;
  const id = request.params.id;
  Book.findOne({
    '_id': id
  })
    .then(bookDetails => {
      response.render('editbooks', {
        book: bookDetails,
        user
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
});

app.post('/editbooks/:id', uploadCloud.single("cover"), (request, response, next) => {
  const {
    user
  } = request.session;
  const bookId = request.params.id;
  const vendorId = user._id;
  const title = request.body.title;
  const gender = request.body.gender;
  const author = request.body.author;
  const price = request.body.price;
  const description = request.body.description;
  const publishCompany = request.body.publishCompany;

  const bookEdit = {
    title: title,
    gender: gender,
    author: author,
    price: price,
    description: description,
    publishCompany: publishCompany,
    vendorId: vendorId
  }
  if (request.file !== undefined) {
    bookEdit.cover = request.file.url;
    bookEdit.imgName = request.file.originalname;
  }
  Book.findOneAndUpdate({
    '_id': bookId
  }, bookEdit, {
    new: true
  })
    .then((editedBook) => {
      response.render('editBookMessage', {
        book: editedBook,
        user
      });
    })
    .catch(error => {
      console.log('An error happened: ', error);
    });
});
// **********  E N D  --  E D I T --  B O O K S  ***********//

// ********** P R O F I L E ***********//
app.get('/profile', (request, response, next) => {
  const {
    user
  } = request.session;
  User.findOne({
    'userName': user.userName
  })
    .then(user => {
      if (user === null) {
        response.render('/profile', {
          errorMessage: 'The username not exists!',
        });
        return;
      } else {
        response.render('profile', {
          user
        });
      }
    })
    .catch(error => {
      console.log('Error: ', error);
    });
});

app.post('/updateAccount', (request, response, next) => {
  const {
    user
  } = request.session;
  const username = request.body.username;
  const password = request.body.password;
  const confirmPassword = request.body.confirmPassword;
  const email = request.body.email;
  const profile = request.body.profile;
  const uesrId = user._id;

  if (password !== confirmPassword) {
    response.render('profile', {
      errorMessage: 'The password and confirmation are not the same',
    });
    return;
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const editedMessage = `User ${username} edited successfully.`

  User.findOneAndUpdate({
    '_id': uesrId
  }, {
    userName: username,
    email,
    password: hashPass,
    profile
  }, {
    new: true
  })
    .then((newUser) => {
      console.log('New user  ', newUser);
      response.render('editProfileMessage', {
        editedMessage,
        user
      });
    })
    .catch(error => {
      console.log(console.log('An error happened: ', error));
    });
});
// ********** E N D  -  P R O F I L E ***********//



// ********** B O O K  -   B U Y ***********//
app.get('/socialBooks/:id', (request, response, next) => {
  const {
    user
  } = request.session;
  const id = request.params.id;
  Book.findOne({
    '_id': id
  })
    .then(bookDetails => {
      response.render('socialBooks', {
        book: bookDetails,
        user
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
});

// ********** E N D -  B O O K  -  B U Y ***********//

app.get('/listbooksBuy', (request, response) => {
  const { user } = request.session;
  if (user.profile === 2) {
    response.render('listbooksSell', { user });
  }
  else {
    Book.find()
      .then(bookFromDB => {
        response.render('listbooksBuy', { books: bookFromDB, user });
      })
      .catch(error => {
        console.log('Error: ', error);
      })
  }
});


app.get('/payment/:id', (request, response, next) => {
  const {
    user
  } = request.session;
  const id = request.params.id;
  Book.findOne({
    '_id': id
  })
    .then(bookDetails => {
      response.render('payment', {
        book: bookDetails,
        user
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
});

app.post('/paymentBook/:id', (request, response, next) => {
  const {
    user
  } = request.session;
  const id = request.params.id
  const title = request.body.title;
  const price = request.body.price;
  const cardnumber = request.body.cardnumber;
  const expiredate = request.body.expiredate;
  const cvv = request.body.cvv;
  const name = request.body.name;

  console.log('o body  ', request.body);

  if (cardnumber === '' || expiredate === '' || cvv === "" || name === "") {
    response.render('/paymentBook/:id', {
      id
    }, {
      errorMessage: 'Please, fill in all credit card details.',
    });
    return;
  } else {
    const bookBuy = new Payment({
      cardNumber: cardnumber,
      cardExpirationDate: expiredate,
      cardCvv: cvv,
      userName: name,
      price: price,
      titleBook: title,
      bookId: id
    });

    bookBuy.save()
      .then((bookBuyAdd) => {
        console.log('Book pay  ', JSON.stringify(bookBuyAdd));
        response.render('payBookMessage', { newBookBuy: bookBuyAdd, user });
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }
});


app.listen(3000, () => console.log('Listen'));


app.listen(process.env.PORT, () => console.log('Listen'));
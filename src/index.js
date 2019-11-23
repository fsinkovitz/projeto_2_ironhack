//require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./Routes/auth.js');
app.use('/', router);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/Views');
app.use(express.static(__dirname + '../../public'));
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb+srv://jesus:F4iC0I35R5snjcIs@cluster0-3dz7l.azure.mongodb.net/ironbook-users?retryWrites=true&w=majority', { useNewUrlParser: true })
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
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));
app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/site-routes'));
app.listen(3000, () => console.log('Listen'));







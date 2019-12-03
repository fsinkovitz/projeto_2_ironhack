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

mongoose.connect('mongodb://heroku_p94lcl9j:4ka96nmi2j57ts545k4a8rp1j5@ds251618.mlab.com:51618/heroku_p94lcl9j', { useNewUrlParser: true })
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

// //Route send mail
// router.post('/send-email', (req, res, next) => {
//   let { email, message } = req.body;
//   let subject = 'Assunto do email';
//   res.render('message', { email, subject, message })

//   let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: 'cristianjesushh@gmail.com',
//       pass: 'Bolinha11@'
//     }
//   });
//   transporter.sendMail({
//     from: '"My Awesome Project 👻" <myawesome@project.com>',
//     to: email,
//     subject: subject,
//     text: message,
//     html: `<b>${message}</b>`
//   })
//     .then(info => res.render('message', { email, subject, message, info }))
//     .catch(error => console.log(error));
// });





app.listen(3000, () => console.log('Listen'));







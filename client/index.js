const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const ejs = require("ejs");
const path = require('path');
const cors = require("cors");
const db = require('./models');
const app = express();
var router         = express.Router();
// Passport authentication Config
require('./config/passport')(passport);

var corsOptions = {
    origin: "http://localhost:8081"
  };
  
app.use(cors(corsOptions));
// connect to mysql

// connection
//   .connect((err) =>{
//       if (!err)
//       {
//         console.log('MYSQL Connected') 
//       }
//       else{
//         console.log('MYSQL Not Connected')
//       }
//   });
db.sequelize.sync().then(() => {
 
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
  //   cookie: {
 
  //     // Session expires after 1 min of inactivity.
  //     expires: 60000
  // }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash messsages
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(path.join(__dirname,'./public')));
// Routes
router.use(function(req, res, next) {
  res.locals.url = req.protocol + '://' + req.headers.host + req.url;
  next();
});

router.use(function(err, req, res, next) {
  if (!err) return next();
  console.error(err.stack);
  res.status(500).render('500', {
      error: err.stack
  });
});
router.use(function(req, res) {
  res.status(404).send({
      url: req.originalUrl,
      error: 'Not Found'
  });
});

app.use('/', require('./routes/index.js'));
app.use('/blog', require('./routes/blog.js'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
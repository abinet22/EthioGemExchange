const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const bcrypt = require('bcryptjs');
router.get('/', forwardAuthenticated, (req, res) => res.render('dashboard'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


router.post('/register', ensureAuthenticated,async function (req, res, next) {

    const {email,password} = req.body;

    const userData = {
        userid: "1",
        password: password,
      userroll:"admin",
       fullname:"abinet",
       isactive:"Yes",
       username:email
     
    }
  let errors =[];
   
    if (errors.length > 0) {
        res.render('login', {
            errors,
           userData
        });
    } else {
  
      User.findAll({
            where: {
              username: email
            }
        }).then(user => {
          //console.log(user);
          console.log(user);
                if (user.length ==0 ) {
                    bcrypt.hash(password, 10, (err, hash) => {
                    userData.password = hash;
  
    
                    User.create(userData)
                        .then(data => {
                          res.render('login',{success_msg:'Successfully Created'})
                        }).catch(err => {
                         
                        }) // end of then catch for create method
                    }); // 
                } else {
                 
                }
            }).catch(err => {
                res.send('ERROR: ' + err)
            }); // end of then catch for findOne method 
    
  
  
    }
  
   
  });



module.exports = router;
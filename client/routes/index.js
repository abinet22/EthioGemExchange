const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const Dealer = db.dealers;
const DealerCompanyInfo = db.dealercompanyinfos;
const Product = db.products;
const GemCategory = db.gemcategories;
const GemSubCategory = db.gemsubcategories;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const bcrypt = require('bcryptjs');

router.get('/', forwardAuthenticated, async function(req, res){

 //  const productlist = await Product.findAll({});
   const [productlist,subprometa] =  await sequelize.query(
    "SELECT * FROM products INNER JOIN gemcategories "+
    " ON products.catid= gemcategories.catid "+
    " INNER JOIN gemsubcategories "+
    " ON gemsubcategories.catid= gemcategories.catid "
  );
   const gemcat = await GemCategory.findAll({});
   const gemsubcat = await GemSubCategory.findAll({});
   const dealerinfo = await DealerCompanyInfo.findAll({});
  res.render('index',{
    product:productlist,
    gemcat:gemcat,
    gemsubca:gemsubcat,
    dealerinfo:dealerinfo
  })
} );
router.get('/login', forwardAuthenticated, async function(req, res) 
{
  const productlist = await Product.findAll({});
  const gemcat = await GemCategory.findAll({});
  const gemsubcat = await GemSubCategory.findAll({});
  const dealerinfo = await DealerCompanyInfo.findAll({});
 res.render('login',{
   product:productlist,
   gemcat:gemcat,
   gemsubca:gemsubcat,
   dealerinfo:dealerinfo
 })
} );
router.get('/register', forwardAuthenticated, async function(req, res) 
{
  const productlist = await Product.findAll({});
  const gemcat = await GemCategory.findAll({});
  const gemsubcat = await GemSubCategory.findAll({});
  const dealerinfo = await DealerCompanyInfo.findAll({});
 res.render('register',{
   product:productlist,
   gemcat:gemcat,
   gemsubca:gemsubcat,
   dealerinfo:dealerinfo
 })
} );
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
  
  // Logout
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success_msg', 'You are logged out');
//     res.redirect('/login');
// });
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

router.post('/register', forwardAuthenticated,async function (req, res, next) {

    const {email,password,first_name,last_name,phone} = req.body;
    const productlist = await Product.findAll({});
  const gemcat = await GemCategory.findAll({});
  const gemsubcat = await GemSubCategory.findAll({});
  const dealerinfo = await DealerCompanyInfo.findAll({});
    if (!email|| !password || !first_name || !last_name || !phone ) {
      errors.push("Please enter all required fields")
     }
    const v1options = {
      node: [0x01, 0x23],
      clockseq: 0x1234,
      msecs: new Date('2011-11-01').getTime(),
      nsecs: 5678,
    };
    userid = uuidv4(v1options);
    const userData = {
        userid: userid,
        password: password,
      userroll:"dealer",
       fullname:first_name +" "+last_name,
       isactive:"Yes",
       username:email,
       phone:phone
     
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
                          res.redirect('/login')
                        }).catch(err => {
                         
                        }) // end of then catch for create method
                    }); // 
                } else {
                 res.render('register',{error_msg:'This Email Already Registered!',product:productlist,
                 gemcat:gemcat,
                 gemsubca:gemsubcat,
                 dealerinfo:dealerinfo})
                }
            }).catch(err => {
              console.log(err)
                res.send('ERROR: ' + err)

            }); // end of then catch for findOne method 
    
  
  
    }
  
   
  });



module.exports = router;
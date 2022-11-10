const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const GemCategory = db.gemcategories;
const GemSubCategory = db.gemsubcategories;
const DealerCompanyInfo = db.dealercompanyinfos;
const Product = db.products;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const bcrypt = require('bcryptjs');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{user:req.user}));
router.get('/dealerlist', ensureAuthenticated,async function (req, res) {

  const dealerinfo = await DealerCompanyInfo.findAll({});
  res.render('dealerlist',{user:req.user,
  dealerinfo:dealerinfo
  })
} );
router.get('/productlist', ensureAuthenticated,async function (req, res){

 const [productlistgemcat,gemmeta] = await sequelize.query(
  "SELECT * FROM products INNER JOIN gemcategories "+
  " ON products.catid= gemcategories.catid "+
  " inner join gemsubcategories on gemsubcategories.catid = gemcategories.catid  "
);
  res.render('productlist',{user:req.user,productlist:productlistgemcat})
} );

router.get('/searchtoaddproductwithcategory', ensureAuthenticated,async function (req, res) {
 
  const gemcat = await GemCategory.findAll({})
  res.render('searchtoaddproductwithcategory',{user:req.user,
    gemcategory:gemcat
  })
 
} );
router.post('/searchtoaddproductwithcategory', ensureAuthenticated,async function (req, res) {
  const{catid} = req.body;
  const gemcat = await GemSubCategory.findAll({where:{catid:catid}})
  const gemmcat = await GemCategory.findAll({})
  if(catid ==0){
    res.render('searchtoaddproductwithcategory',{user:req.user,
      gemcategory:gemmcat,
      catid:catid,
      error_msg:"Please Select Category First!"
    })
  }else{
    res.render('addproduct',{user:req.user,
      gemsubcategory:gemcat,
      catid:catid
    })
  }
  
 
} );
router.get('/addcompanyinfo', ensureAuthenticated, (req, res) => res.render('addcompanyinfo',{user:req.user}));
router.get('/addsubcategory', ensureAuthenticated,async function (req, res) 
{
  const gemcat = await GemCategory.findAll({})
  res.render('addsubcategory',{user:req.user,
    gemcategory:gemcat
  })
});
router.get('/addcategory', ensureAuthenticated, (req, res) => res.render('addcategory',{user:req.user}));
router.get('/adddealer', ensureAuthenticated, (req, res) => res.render('adddealer',{user:req.user}));

router.get('/companyinfo', ensureAuthenticated, (req, res) => res.render('companyinfo',{user:req.user}));
router.get('/subcategorylist', ensureAuthenticated, async function(req, res)

 {
  const [gemcat,gemmeta] = await sequelize.query(
    "SELECT * FROM gemsubcategories INNER JOIN gemcategories ON gemcategories.catid= gemsubcategories.catid "
  );
  res.render('subcategorylist',{user:req.user,
    gemcategory:gemcat
  })
 }
 );
router.get('/categorylist', ensureAuthenticated,async function (req, res) {

 const gemcat = await GemCategory.findAll({})
  res.render('categorylist',{user:req.user,
    gemcategory:gemcat
  })

});

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
    res.redirect('/login');
  });
});
router.post('/register', forwardAuthenticated,async function (req, res, next) {

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
   console.log(userData);
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
                         console.log(err)
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
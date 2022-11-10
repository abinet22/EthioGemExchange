const express = require('express');
const router = express.Router();

const db = require('../models');
var nodemailer = require('nodemailer');


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

router.get('/productlistbycategory/(:subcatname)/(:subcatid)', forwardAuthenticated, async function(req, res){

   //const productlist = await Product.findAll({where:{subcatid:req.params.subcatid}});
   const [productlist,subprolistmeta] =  await sequelize.query(
    "SELECT * FROM products INNER JOIN gemcategories "+
    " ON products.catid= gemcategories.catid "+
    " INNER JOIN gemsubcategories "+
    " ON gemsubcategories.catid= gemcategories.catid where products.subcatid='"+req.params.subcatid+"' "
  );
   const gemcat = await GemCategory.findAll({});
   const gemsubcat = await GemSubCategory.findAll({});
   const dealerinfo = await DealerCompanyInfo.findAll({});
   const [subproinfo,subprometa] =  await sequelize.query(
    "SELECT * FROM gemsubcategories INNER JOIN gemcategories "+
    " ON gemsubcategories.catid= gemcategories.catid "+
    " where gemsubcategories.subcatid = '"+req.params.subcatid+"'"
  );
  res.render('showproductbycategory',{
    productlist:productlist,
    gemcat:gemcat,
    gemsubca:gemsubcat,
    dealerinfo:dealerinfo,
    catinfo:subproinfo,
    tag:"category"
  })
})
router.get('/shopproductlist/(:shopname)/(:shopid)', forwardAuthenticated, async function(req, res){

  const productlist = await Product.findAll({where:{dealerid:req.params.shopid}});
  const gemcat = await GemCategory.findAll({});
  const gemsubcat = await GemSubCategory.findAll({});
  const dealerinfo = await DealerCompanyInfo.findAll({});
  const [subproinfo,subprometa] =  await sequelize.query(
   "SELECT * FROM dealercompanyinfos where compid = '"+req.params.shopid+"'"
 );
 res.render('shopproductlist',{
   productlist:productlist,
   gemcat:gemcat,
   gemsubca:gemsubcat,
   dealerinfo:dealerinfo,
   catinfo:subproinfo,
   tag:"shop"
 })
})
router.get('/productdetail/(:proid)', forwardAuthenticated, async function(req, res){


    const productlist = await Product.findOne({where:{proid:req.params.proid}});
    const gemcat = await GemCategory.findAll({});
    const gemsubcat = await GemSubCategory.findAll({});
    const dealerinfo = await DealerCompanyInfo.findAll({});
    // const relatedproduct = await Product.findAll({});
    // const recentproduct = await Product.findAll({});
    const [relatedproduct,relatedproductmeta] =  await sequelize.query(
      "SELECT * FROM products INNER JOIN gemcategories "+
      " ON products.catid= gemcategories.catid "+
      " INNER JOIN gemsubcategories "+
      " ON gemsubcategories.catid= gemcategories.catid  "
    );
    const [recentproduct,recentproductmeta] =  await sequelize.query(
      "SELECT * FROM products INNER JOIN gemcategories "+
      " ON products.catid= gemcategories.catid "+
      " INNER JOIN gemsubcategories "+
      " ON gemsubcategories.catid= gemcategories.catid  "
    );
    console.log(productlist)
   if(productlist){
    res.render('productdetail',{
      productlist:productlist,
      gemcat:gemcat,
      gemsubca:gemsubcat,
      relatedproduct:relatedproduct,
      dealerinfo:dealerinfo,
      recentproduct:recentproduct
    })
   }else{
    res.render('productdetail',{
      productlist:'',
      gemcat:gemcat,
      gemsubca:gemsubcat,
      relatedproduct:relatedproduct,
      dealerinfo:dealerinfo,
      recentproduct:recentproduct
    })
   }
  
 } );
 router.post('/sendemail',forwardAuthenticated,async function(req,res){
  const{contactphone,contactbody,contactemail,contactname,productname,productid} = req.body;
  var transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'raven.legros@ethereal.email',
        pass: 'gaajFFDSYcwAubGghB'
    }
  });
  
  var mailOptions = {
    from: contactemail,
    to: 'abinet22@gmail.com',
    subject: contactphone,
    text: contactbody +contactname
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 })
module.exports = router;
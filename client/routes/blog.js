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
router.get('/', forwardAuthenticated, async function(req, res) 
{
    const productlist = await Product.findAll({});
    const gemcat = await GemCategory.findAll({});
    const gemsubcat = await GemSubCategory.findAll({});
    const dealerinfo = await DealerCompanyInfo.findAll({});
   res.render('blog',{
     product:productlist,
     gemcat:gemcat,
     gemsubca:gemsubcat,
     dealerinfo:dealerinfo
   })
} );




module.exports = router;
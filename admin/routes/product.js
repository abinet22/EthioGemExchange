const express = require('express');
const router = express.Router();

const db = require('../models');
const fs = require('fs');
const path = require('path');
const GemCategory = db.gemcategories;
const GemSubCategory = db.gemsubcategories;
const sequelize = db.sequelize ;
const Product = db.products;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const upload = require('../middleware/upload.js');


router.post('/addnewproduct',upload.array('productimage'), ensureAuthenticated,async function(req, res) {
 
    const{catid,subcatid,productdescription,productdetailinfo,
    sizemax,sizemin,productoverview,weight,price} = req.body;
    let errors = [];
    const gemcat = await GemSubCategory.findAll({where:{catid:catid}})
try{
        if (!subcatid ) {
            errors.push("Please enter all required fields")
        }
        if(!req.files){
            errors.push("Please upload banner image for your category")
        }
        if(errors.length>0){
            res.render("addcategory",{error_msg:errors})
        }
    
    
        else {
            const v1options = {
                node: [0x01, 0x23],
                clockseq: 0x1234,
                msecs: new Date('2011-11-01').getTime(),
                nsecs: 5678,
              };
              proid = uuidv4(v1options);
         Product.create({
            proid: proid,
            catid: catid,
            subcatid: subcatid,
            productoverview:productoverview,
            productdescription:productdescription,
              productdetailinfo:productdetailinfo,
              sizemax: sizemax,
              sizemin:sizemin,
              weight:weight,
              price: price,
              productimagen1:req.files[0].filename,
              productimagen2:req.files[1].filename,
              productimagen3:req.files[2].filename,
              productimagen4:req.files[3].filename,
              productimagen5:req.files[4].filename,

              productimage1: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.files[0].filename
              ),
              productimage2: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.files[1].filename
              ),
              productimage3:fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.files[2].filename
              ),
              productimage4:fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.files[3].filename
              ),
              productimage5: fs.readFileSync(
                path.join(__dirname,'../public/uploads/') + req.files[4].filename
              ),
              dealerid: req.user.userid,
              issold: "No",
              isactive: "Yes",
          
         }).then((image)=>{
            fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.productimagen1,
   
            image.productimage1
          );
          fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.productimagen2,
   
          image.productimage2
        ); fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.productimagen3,
   
        image.productimage3
      ); fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.productimagen4,
   
      image.productimage4
    ); fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.productimagen5,
   
    image.productimage5
  );
          res.render('addproduct',{
            user:req.user,
            gemsubcategory:gemcat,
            catid:catid,
            success_msg:'You Are Successfully Register New Product!'
            });
         }).catch(err =>{
            console.log(err)
        });
        }
} catch(err){
    console.log(err)
}





});





module.exports = router;
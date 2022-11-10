const express = require('express');
const router = express.Router();

const db = require('../models');
const fs = require('fs');
const path = require('path');
const GemCategory = db.gemcategories;
const GemSubCategory = db.gemsubcategories;
const DealerCompanyInfo = db.dealercompanyinfos;
const Dealer = db.dealers;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const upload = require('../middleware/upload.js');

router.get('/editdealerinfo/(:compid)',upload.single('shopbanner'), ensureAuthenticated,async function(req, res) {
 const dealerinfo = await DealerCompanyInfo.findOne({where:{compid:req.params.compid}});
 res.render("editdealerinfo",{
     user:req.user,
     dealerinfo:dealerinfo
 })
} )
router.get('/createdealercredential/(:compid)',upload.single('shopbanner'), ensureAuthenticated,async function(req, res) {
    const dealerinfo = await DealerCompanyInfo.findOne({where:{compid:req.params.compid}});
    res.render("createcredential",{
        user:req.user,
        dealerinfo:dealerinfo
    })
   } )
router.post('/addnewdealerinfo',upload.single('shopbanner'), ensureAuthenticated,async function(req, res) {
 
    const{compname,compabout,contactaddress,contactfname,contactlname,
    contactphone,contactpobox,contactweb,contactoffice,contactemail}= req.body;
    let errors = [];

try{
        if ( !compname || !compabout || !contactaddress || !contactfname || !contactlname || !
            contactphone || !contactpobox || !contactweb || !contactoffice || !contactemail) {
            errors.push("Please enter all required fields")
        }
        if(!req.file){
            errors.push("Please upload banner image for your category")
        }
        if(errors.length>0){
            res.render("adddealer",{error_msg:errors})
        }
    
    
        else {
            DealerCompanyInfo.findOne({where:{compname:compname}}).then(dealer =>{
                if(!dealer)
                {
                    const v1options = {
                        node: [0x01, 0x23],
                        clockseq: 0x1234,
                        msecs: new Date('2011-11-01').getTime(),
                        nsecs: 5678,
                      };
                      compid = uuidv4(v1options);
                    
                      DealerCompanyInfo.create({
                    userid: compid,
                    compid:compid,
                    compname:compname,
                    compabout:compabout,
                    contactfname:contactfname,
                    contactlname:contactlname,
                    contactoffice:contactoffice,
                    contactphone:contactphone,
                    contactaddress:contactaddress,
                    contactpobox:contactpobox,
                    contactweb:contactweb,
                    contactemail:contactemail,
                    simagetype:req.file.mimetype,
                      simagename:req.file.filename,
                      simagedata:fs.readFileSync(
                        path.join(__dirname,'../public/uploads/') + req.file.filename
                      ),
  
                  

                 }).then((image)=>{
                    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.simagename,
           
                    image.simagedata
                  );
               
                  res.render('adddealer',{
                    user:req.user,
                    success_msg:'You Are Successfully Register New Dealer Company Info!'
                    });
                 }).catch(err =>{
                    console.log(err)
                });

            }else{
                res.render('adddealer',{
                    user:req.user,
                    error_msg:'Dealer With This Name Already Registered!'
                    });
            }
          
         }).catch(err =>{
           console.log(err)
        });
        }
} catch(err){
    console.log(err)
}





});





module.exports = router;
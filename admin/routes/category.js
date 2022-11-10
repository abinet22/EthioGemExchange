const express = require('express');
const router = express.Router();

const db = require('../models');
const fs = require('fs');
const path = require('path');
const GemCategory = db.gemcategories;
const GemSubCategory = db.gemsubcategories;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const upload = require('../middleware/upload.js');


router.get('/editcategory/(:catid)',async function(req,res){

    res.render("editcategory",{
        catid:req.params.catid
    })

})

router.post('/addnewcategory',upload.single('bannerphoto'), ensureAuthenticated,async function(req, res) {
 
    const{categoryoverview,categoryname} = req.body;
    let errors = [];

try{
        if (!categoryoverview || !categoryname ) {
            errors.push("Please enter all required fields")
        }
        if(!req.file){
            errors.push("Please upload banner image for your category")
        }
        if(errors.length>0){
            res.render("addcategory",{error_msg:errors})
        }
    
    
        else {
         GemCategory.findOne({where:{catname:categoryname}}).then(gemcategory =>{
                if(!gemcategory)
                {
                    const v1options = {
                        node: [0x01, 0x23],
                        clockseq: 0x1234,
                        msecs: new Date('2011-11-01').getTime(),
                        nsecs: 5678,
                      };
                      catid = uuidv4(v1options);
                 GemCategory.create({
                    catid:catid,
                    catname:categoryname,
                    catoverview:categoryoverview,
                    bimagetype:req.file.mimetype,
                    bimagename: req.file.filename,
                    bimagedata: fs.readFileSync(
                      path.join(__dirname,'../public/uploads/') + req.file.filename
                    ),

                 }).then((image)=>{
                    fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.bimagename,
           
                    image.bimagedata
                  );
                  res.render('addcategory',{
                    user:req.user,
                    success_msg:'You Are Successfully Register New GemStone Category!'
                    });
                 }).catch(err =>{
                    console.log(err)
                });

            }else{
                res.render('addcategory',{
                    user:req.user,
                    error_msg:'GemStone Category With This name Already Registered!'
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
router.post('/addnewsubcategory', ensureAuthenticated,async function(req, res) {
 
    const{catid,subcategoryname} = req.body;
    let errors = [];
    const gemcat = await GemCategory.findAll({})
try{
        if (!catid || !subcategoryname ) {
            errors.push("Please enter all required fields")
        }
        if (catid==="0" ) {
            errors.push("Please select all category")
        }
        if(errors.length>0){
            res.render("addsubcategory",{error_msg:errors,
                gemcategory:gemcat
            })
        }
    
    
        else {
         GemSubCategory.findOne({where:{subcatname:subcategoryname}}).then(gemcategory =>{
                if(!gemcategory)
                {
                    const v1options = {
                        node: [0x01, 0x23],
                        clockseq: 0x1234,
                        msecs: new Date('2011-11-01').getTime(),
                        nsecs: 5678,
                      };
                      subcatid = uuidv4(v1options);
                 GemSubCategory.create({
                    subcatid:subcatid,
                    subcatname:subcategoryname,
                    catid:catid

                 }).then((subcatdata)=>{
                    
                  res.render('addsubcategory',{
                    user:req.user,
                    gemcategory:gemcat,
                    success_msg:'You Are Successfully Register New GemStone SubCategory!'
                    });
                 }).catch(err =>{
                    console.log(err)
                });

            }else{
                res.render('addsubcategory',{
                    user:req.user,
                    gemcategory:gemcat,
                    error_msg:'GemStone SubCategory With This name Already Registered!'
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
router.post('/editsubcategory/(:subcatid)',ensureAuthenticated,async function(req, res) {
 
    const{subcategoryname} = req.body;
    let errors = [];
    const [gemcat,gemmeta] = await sequelize.query(
        "SELECT * FROM gemsubcategories INNER JOIN gemcategories ON gemcategories.catid= gemsubcategories.catid "
      );
    
try{
        if (!subcategoryname ) {
            errors.push("Please enter all required fields")
        }
       
        if(errors.length>0){
            res.render('subcategorylist',{user:req.user,
                gemcategory:gemcat,
                error_msg:errors
              })
        }
    
    
        else {
         GemSubCategory.findOne({where:{subcatid:req.params.subcatid}}).then(gemcategory =>{
             console.log(gemcategory)
                if(gemcategory)
                {
                  
                    GemSubCategory.update({
                    subcatname:subcategoryname
                 },{where:{subcatid:req.params.subcatid}}).then((image)=>{
                    res.render('subcategorylist',{user:req.user,
                        gemcategory:gemcat,
                       
                        success_msg:'GemStone SubCategory Name Updated Successfully!'
                      })
                 }).catch(err =>{
                    console.log(err)
                });

            }else{
                res.render('subcategorylist',{user:req.user,
                    gemcategory:gemcat,
                    error_msg:'GemStone Category With This ID Cant Find!'
                  })
               
            }
          
         }).catch(err =>{
             console.log(err)
            res.render('subcategorylist',{user:req.user,
                gemcategory:gemcat,
                error_msg:'Error While Finding GemStone Category With This ID Cant Find!'
              })
        });
        }
} catch(err){
  
        res.render('subcategorylist',{user:req.user,
            gemcategory:gemcat,
            error_msg:'Problem Updating GemStone Category!'
          })
}

});
router.post('/editproductcategorysubmit',upload.single('bannerphoto'), ensureAuthenticated,async function(req, res) {
 
    const{categoryoverview,catid} = req.body;
    let errors = [];

try{
        if (!categoryoverview || !catid ) {
            errors.push("Please enter all required fields")
        }
        if(!req.file){
            errors.push("Please upload banner image for your category")
        }
        if(errors.length>0){
            res.render("editcategory",{error_msg:errors,
                catid:catid,
            })
        }
    
    
        else {
         GemCategory.findOne({where:{catid:catid}}).then(gemcategory =>{
             console.log(gemcategory)
                if(gemcategory)
                {
                  
                    GemCategory.update({
                 
                    catoverview:categoryoverview,
                    bimagetype:req.file.mimetype,
                    bimagename: req.file.filename,
                    bimagedata: fs.readFileSync(
                      path.join(__dirname,'../public/uploads/') + req.file.filename
                    )

                 },{where:{catid:catid}}).then((image)=>{
                //     fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.bimagename,
           
                //     image.bimagedata
                //   );
                  res.render('editcategory',{
                    user:req.user,
                    catid:catid,
                    success_msg:'You Are Successfully Update New GemStone Category Info!'
                    });
                 }).catch(err =>{
                    console.log(err)
                });

            }else{
                res.render('editcategory',{
                    user:req.user,
                    catid:catid,
                    error_msg:'GemStone Category With This ID Cant Find!'
                    });
            }
          
         }).catch(err =>{
            res.render('editcategory',{
                user:req.user,
                catid:catid,
                error_msg:'GemStone Category With This ID Cant Find!'
                });
        });
        }
} catch(err){
    res.render('editcategory',{
        user:req.user,
        catid:catid,
        error_msg:'Problem Updating GemStone Category!'
        });
}

});




module.exports = router;
const express=require('express');
const {ensureAuth,ensureGuest} =require('../middleware/auth')
const Story=require('../models/Story')
const router=express.Router();
router.get('/',ensureGuest,(req,res)=>{
  res.render('login',{
    layout:'login'
  })
})
router.get('/dashboard',ensureAuth,async(req,res)=>{
  try {
    const stories=await Story.find({user:req.user.id}).lean()
    res.render('dashboard',{
    name:req.user.firstName,
    stories
  })
  } catch (error) {
    console.log(error);
    res.render('error/500')
    
  }
  
})
module.exports=router;
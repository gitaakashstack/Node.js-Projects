const express=require('express');
const router=express.Router();

const batsmanController=require('../Controller/batsman');
const {isUser,isAdmin}=require("../middleware/isAuth.js");

router.get("/register",isAdmin,batsmanController.getRegBatsman);

router.post("/register",isAdmin,batsmanController.postRegBatsman);

router.get("/update/:plid",isAdmin,batsmanController.getUpdateBatsman);

router.post("/update/:plid",isAdmin,batsmanController.postUpdateBatsman);

router.get("/delete/:plid",isAdmin,batsmanController.deleteBatsman);

router.get("/displayall",isUser,batsmanController.displayAllBatsman);

module.exports=router;

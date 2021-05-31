const express=require('express');
const router=express.Router();
const bowlerController=require('../Controller/bowler');
const {isUser,isAdmin}=require("../middleware/isAuth.js");

router.get("/register",isAdmin,bowlerController.getRegBowler);

router.post("/register",isAdmin,bowlerController.postRegBowler);

router.get("/update/:plid",isAdmin,bowlerController.getUpdateBowler);

router.post("/update/:plid",isAdmin,bowlerController.postUpdateBowler);

router.get("/delete/:plid",isAdmin,bowlerController.deleteBowler);

router.get("/displayall",isUser,bowlerController.displayAllBowler);


module.exports=router;
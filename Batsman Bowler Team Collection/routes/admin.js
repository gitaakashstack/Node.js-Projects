const express=require('express');
const router=express.Router();

const { body }=require('express-validator');

const adminController=require('../Controller/admin.js');

router.get("/login",adminController.getLogIn);

router.post("/login",
                    body('email')
                        .isEmail()
                        .withMessage("Invalid email")
                        .normalizeEmail(),
                    body('password')
                        .trim(),
                    adminController.postLogIn);

router.get("/logout",adminController.getLogOut);

module.exports=router;
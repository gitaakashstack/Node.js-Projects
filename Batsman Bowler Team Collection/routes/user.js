const express=require('express');
const router=express.Router();

const { body }=require('express-validator');

const Userx=require('../model/user.js');
const userController=require('../Controller/user.js');

router.get("/login",userController.getLogIn);

router.post("/login",
                    body('email')
                        .isEmail()
                        .withMessage("Invalid email")
                        .normalizeEmail(),
                    body('password')
                        .trim()
                        .isStrongPassword({minLength:3,minLowecase:0,minUppercase:0,minSymbols:1})
                        .withMessage("Please enter a password with at least 3 characters long and at least 1 special character"),
                    userController.postLogIn);

router.get("/signup",userController.getSignUp);

router.post("/signup",
                    body('email')
                        .isEmail()
                        .withMessage("Invalid email")
                        .normalizeEmail()
                        .custom(function(val,{req}){
                           return Userx.existsUser(val)
                            .then((exists)=>{
                                if(exists)
                                    return Promise.reject("Email already exists");
                            return true;
                            });
                        }),
                    body('password')
                        .trim()
                        .isStrongPassword({minLength:3,minLowecase:0,minUppercase:0,minSymbols:1})
                        .withMessage("Please enter a password with at least 3 characters long and at least 1 special character"),
                    body('cnfpassword')
                        .trim()
                        .custom(function(val,{req}){
                            if(val!=req.body.password)
                                return Promise.reject("Passwords do not match");
                            return true;
                        }),
                    userController.postSignUp);

router.get("/logout",userController.getLogOut);



module.exports=router;
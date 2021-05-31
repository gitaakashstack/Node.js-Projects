const Userx=require("../model/user.js");
const bcrypt=require('bcrypt');
const { validationResult }=require('express-validator');

exports.getLogIn=function(req,res,next){
    res.render("login.ejs",{
        pageTitle:"Log In",
        navbtn:"login",
        errorMsg:''
    });
}

exports.postLogIn=function(req,res,next){
    const {email,password}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).render('login.ejs',{
            pageTitle:"Log In",
            navbtn:"login",
            errorMsg:errors.array()[0].msg,
            oldInput:{
                email,
                password
            }
        });
    }
    let curUser;
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        curUser=new Userx(email,hashedPassword);
        return curUser;
    })
    .then((curUser)=>{
        curUser.findUser()
        .then((user)=>{
            if(user){
                bcrypt.compare(password,user.password)
                .then((match)=>{
                    if(match){
                         req.session.user=curUser;
                         req.session.isLoggedInAsUser=true;
                         req.session.isLoggedInAsAdmin=false;
                         req.session.save(function(err){
                             console.log(err);
                             res.redirect('/home');
                         });          
                    }
                    else{
                         console.log("login failed");
                         res.status(401).render('login.ejs',{
                             pageTitle:"Log In",
                             navbtn:"login",
                             errorMsg:"Inavalid Email or Password", //Actually here error is due to invalid password only, but to avoid giving any hint to miscreants we mention both invalid email or passowrd
                             oldInput:{
                                 email,
                                 password
                             }
                         })
                    }
                })
                .catch((err)=>{
                    const error=new Error(err);
                    error.httpStatusCode=500;
                    next(error);
                });
            }
            else{
                 console.log("login failed");
                 return res.status(401).render('login.ejs',{
                     pageTitle:"Log In",
                     navbtn:"login",
                     errorMsg:"Email does not exist", 
                     oldInput:{
                         email,
                         password
                     }
                 })
            }
        })
        .catch((err)=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            next(error);
        });
    });
}


exports.getSignUp=function(req,res,next){
    res.render("signup.ejs",{
        pageTitle:"Sign Up",
        navbtn:"signup",
        errorMsg:''
    });
}

exports.postSignUp=function(req,res,next){
    console.log("in post signup");
    const {email,password,cnfpassword}=req.body;
    const errors=validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(401).render('signup.ejs',{
            pageTitle:"Sign Up",
            navbtn:"signup",
            errorMsg:errors.array()[0].msg,
            oldInput:{
                email,
                password,
                cnfpassword
            }
        })
    }
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const newUser=new Userx(email,hashedPassword);
        return newUser.createUser()
    })
    .then(()=>res.redirect('/user/login'))
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}

exports.getLogOut=function(req,res,next){
    req.session.destroy(function(err){
        if(err)
            console.log(err);
        res.redirect("/home");
    })

}
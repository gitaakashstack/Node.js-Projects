const Adminx=require("../model/admin.js");
const bcrypt=require('bcrypt');
const { validationResult }=require('express-validator');

exports.getLogIn=function(req,res,next){
    res.render("admin_login.ejs",{
        pageTitle:"Log In",
        navbtn:"login",
        errorMsg:''
    });
}

exports.postLogIn=function(req,res,next){
    const {email,password}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(404).render('admin_login.ejs',{
            pageTitle:"Log In",
            navbtn:"login",
            errorMsg:errors.array()[0].msg,
            oldInput:{
                email,
                password
            }
        })
    }
    let curAdmin;
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        curAdmin=new Adminx(email,hashedPassword);
        return curAdmin;
    })
    .then((curAdmin)=>{
        curAdmin.findAdmin()
                .then((admin)=>{
                    if(admin){
                        bcrypt.compare(password,admin.password)
                        .then((match)=>{
                            if(match){
                                 req.session.user=curAdmin;
                                 req.session.isLoggedInAsUser=false;
                                 req.session.isLoggedInAsAdmin=true;
                                 req.session.save(function(err){
                                     console.log(err);
                                     res.redirect('/home');
                                 });          
                            }
                            else{
                                 console.log("login failed");
                                 res.status(404).render('admin_login.ejs',{
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

                    }
                    else{
                         console.log("login failed");
                         res.status(404).render('admin_login.ejs',{
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
    });
}

exports.getLogOut=function(req,res,next){
    req.session.destroy(function(err){
        if(err)
            console.log(err);
        res.redirect("/home");
    })

}
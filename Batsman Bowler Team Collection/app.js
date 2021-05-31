const express=require('express');
const app=express();

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const store=new MongoDBStore({
    uri:'mongodb://passwordmongodb:passwordmongodb@cluster0-shard-00-00.h6pu1.mongodb.net:27017,cluster0-shard-00-01.h6pu1.mongodb.net:27017,cluster0-shard-00-02.h6pu1.mongodb.net:27017/players?ssl=true&replicaSet=atlas-c1e89s-shard-0&authSource=admin&retryWrites=true&w=majority',
    collection:'sessions'
});

const path=require('path');

const batsmanRouter=require("./routes/batsman.js");
const bowlerRouter=require("./routes/bowler.js");
const userRouter=require("./routes/user.js");
const adminRouter=require("./routes/admin.js");
const multer=require('multer');
const bodyParser=require('body-parser');//setting body parser module
const mongoose=require('mongoose');
const csrf = require('csurf');



app.set('view engine','ejs');
app.set('views','views');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        let curDate=new Date();
        curDate=curDate.toISOString().replace(/:/g,'-');
        cb(null,curDate+'_'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype=="image/jpg" || file.mimetype=="image/jpeg")
            cb(null,true);
    else
        cb(null,false);

}
const upload=multer({storage:storage,fileFilter:fileFilter});

app.use(bodyParser.urlencoded({extended:false}));//parsing all the data which is urlencoded and provides a property req.body
app.use(upload.single('image'));
app.use(express.static(path.resolve("public")));
app.use('/images',express.static(path.resolve("images")));


app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use(csrf());
app.use(function(req,res,next){
    res.locals.isLoggedInAsUser=req.session.isLoggedInAsUser;
    res.locals.isLoggedInAsAdmin=req.session.isLoggedInAsAdmin;
    res.locals.csrfToken=req.csrfToken();
    next();
    /*since the nav bar needs to be different for logged in users, we have to pass the req.session.isLoggedInAsUser and req.session.isLoggedInAsAdmin
    to all the views(ejs files), so that proper JS code can be executed on to decide which nav button to display and which to hide. If we
    don't do it as above, we will have to send the two session variables in each object of res.render() because navigation bar is part of
    every page. The above method allows us to send the 2 variables to all the views in a single step. */
});

app.use("/batsman",batsmanRouter);
app.use("/bowler",bowlerRouter);
app.use("/user",userRouter);
app.use("/admin",adminRouter);

app.get("/home",function(req,res,next){
    console.log("in home");
    res.render('home',{
        pageTitle:'Home',
        navbtn:"home",
    });
});
app.get("/about",function(req,res,next){
    res.render('about',{
        pageTitle:'About',
        navbtn:"about"
    });
});
app.use("/",function(req,res,next){
    res.status(404).sendFile(path.resolve("views","error.html"));
});
app.use(function(err,req,res,next){
    if(err.httpStatusCode==500){
        res.status(500).render('err_page.ejs',{
            pageTitle:'Error',
            navbtn:'error',
            status:err.httpStatusCode
        });}
    else if(err.httpStatusCode==403){
        console.log("heh");
        res.status(403).render('err_page.ejs',{
            pageTitle:'Error',
            navbtn:'error',
            status:err.httpStatusCode
        });}
    else
    {}
});
mongoose
.connect('mongodb://passwordmongodb:passwordmongodb@cluster0-shard-00-00.h6pu1.mongodb.net:27017,cluster0-shard-00-01.h6pu1.mongodb.net:27017,cluster0-shard-00-02.h6pu1.mongodb.net:27017/players?ssl=true&replicaSet=atlas-c1e89s-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
})
.then((res)=>{
    console.log("Connected to Database");
    app.listen(2500);
})
.catch((err)=>console.log(err));




exports.isUser=function(req,res,next){
    if(!req.session.isLoggedInAsUser && !req.session.isLoggedInAsAdmin)
        return res.status(403).redirect("/user/login");
    next();
}

exports.isAdmin=function(req,res,next){
    if(!req.session.isLoggedInAsAdmin)
    {
        console.log("here");
        const error=new Error("Unauthorized");
        error.httpStatusCode=403;
        return next(error);
    }
    next();
}
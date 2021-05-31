const Batterx=require('../model/batsman.js');
const path=require('path');
const fs=require('fs').promises;
const mongoose=require('mongoose');
const ITEMS_PER_PAGE=3;

exports.getRegBatsman=function(req,res,next){
    return res.render('register_bat',{
        pageTitle:'Register a Batsman',
        navbtn:"register",
        edit:false
    });
}

exports.postRegBatsman=function(req,res,next){
    const { name,team,runs,avg }=req.body;
    const imageUrl=req.file.path;
    let newPlayer=new Batterx(name,team.toUpperCase(),runs,avg,imageUrl);
    newPlayer.save()
    .then(()=>{
        res.redirect("/batsman/displayall");
    })
    .catch((err)=>{
        const error=new Error(err);
        console.log(err);
        error.httpStatusCode=500;
        next(error);
    }); 
}

exports.displayAllBatsman=function(req,res,next){
    const curPage= +req.query.page || 1;
    let totalBatterCount;
    Batterx.getCount()
    .then(count=>{
        totalBatterCount=count; 
        return Batterx.readSomePlayers(curPage,ITEMS_PER_PAGE);
    })
    .then(allBatters=>{
        const lastPage=Math.ceil(totalBatterCount/ITEMS_PER_PAGE);
        res.render('display_bat.ejs',{
            pageTitle:'All Batters',
            navbtn:'allplayers',
            allPlayers:allBatters,
            curPage:curPage,
            hasPrevPage:curPage!=1,
            hasNextPage:curPage!=lastPage,
            lastPage:lastPage
        });
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}

exports.getUpdateBatsman=function(req,res,next){
    const id=req.params.plid;
    Batterx.readPlayerById(id)
    .then(function(playerOldData){  
        res.render('register_bat',{
            pageTitle:'Update a Player',
            navbtn:"update",
            edit:true,
            player:playerOldData
        });
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}
exports.postUpdateBatsman=function(req,res,next){
    const id=req.params.plid;
    const { name:upname,team:upteam,runs:upruns,avg:upavg }=req.body;
    const upimage=req.file;
    let upimageurl;
    Batterx.readPlayerById(id)
    .then(function(playerToBeUpd){
        console.log(playerToBeUpd);
        upimageurl=playerToBeUpd.imageUrl;
        if(upimage)
        {   
            const imageUrlToBeDel=playerToBeUpd.imageUrl;
            fs.unlink(imageUrlToBeDel)
            .then(()=>console.log("deleted"))
            .catch((err)=>{
                console.log("ublin");
                const error=new Error(err);
                error.httpStatusCode=500;
                next(error);
            });
            upimageurl=upimage.path;
        }
        return playerToBeUpd;
    })
    .then((playerToBeUpd)=>{
        const upPlayer=new Batterx(upname,upteam.toUpperCase(),upruns,upavg,upimageurl);
        return upPlayer.UpdateAndSave(playerToBeUpd);
    })
    .then(()=>res.redirect('/batsman/displayall'))
    .catch(err=>{
        console.log("ehee");
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}

exports.deleteBatsman=function(req,res,next){
    Batterx.deletePlayerById(req.params.plid)
    .then(function(){
        console.log("after written");
        res.redirect("/batsman/displayall");
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}
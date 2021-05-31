const Bowlerx=require('../model/bowler.js');
const path=require('path');
const ITEMS_PER_PAGE=3;

exports.getRegBowler=function(req,res,next){
    return res.render('register_bow',{
        pageTitle:'Register a Bowler',
        navbtn:"register",
        edit:false
    });
}

exports.postRegBowler=function(req,res,next){
    const { name,team,wkts,avg }=req.body;
    const imageUrl=req.file.path;
    let newPlayer=new Bowlerx(name,team.toUpperCase(),wkts,avg,imageUrl);
    newPlayer.save()
    .then(()=>{
        res.redirect("/bowler/displayall");
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}

exports.displayAllBowler=function(req,res,next){
    const curPage= +req.query.page || 1;
    let totalBowlerCount;
    Bowlerx.getCount()
    .then(count=>{
        totalBowlerCount=count; 
        return Bowlerx.readSomePlayers(curPage,ITEMS_PER_PAGE);
    })
    .then(allBowlers=>{
        const lastPage=Math.ceil(totalBowlerCount/ITEMS_PER_PAGE);
        res.render('display_bow.ejs',{
            pageTitle:'All Bowlers',
            navbtn:'allplayers',
            allPlayers:allBowlers,
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

exports.getUpdateBowler=function(req,res,next){
    const id=req.params.plid;
    Bowlerx.readPlayerById(id)
    .then(function(playerOldData){  
        res.render('register_bow',{
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
exports.postUpdateBowler=function(req,res,next){
    const id=req.params.plid;
    const { name:upname,team:upteam,wkts:upwkts,avg:upavg }=req.body;
    const upimage=req.file;
    let upimageurl;
    Bowlerx.readPlayerById(id)
    .then(function(playerToBeUpd){
        console.log(playerToBeUpd);
        upimageurl=playerToBeUpd.imageUrl;
        if(upimage)
        {   
            const imageUrlToBeDel=playerToBeUpd.imageUrl;
            fs.unlink(imageUrlToBeDel)
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
        const upPlayer=new Bowlerx(upname,upteam.toUpperCase(),upwkts,upavg,upimageurl);
        return upPlayer.UpdateAndSave(playerToBeUpd);
    })
    .then(()=>res.redirect('/bowler/displayall'))
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}

exports.deleteBowler=function(req,res,next){
    Bowlerx.deletePlayerById(req.params.plid)
    .then(function(){
        console.log("after written");
        res.redirect("/displayplayers");
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        next(error);
    });
}
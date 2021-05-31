const mongoose=require('mongoose');
const fs=require('fs').promises;
const { Team }=require('./team.js');
const Schema=mongoose.Schema;

const batterSchema=new Schema({
    name:String ,
    runs:Number,
    avg: Number,
    imageUrl:String,
    team:{
        type:mongoose.ObjectId,
        ref:'Team'
    }
});

const Batter=mongoose.model("Batter",batterSchema);

module.exports=class Batterx {
    constructor(name,team,runs,avg,imageUrl){
        this.name=name;
        this.team=team;
        this.runs=runs;
        this.avg=avg;
        this.imageUrl=imageUrl;
    }

    async save(){
        const team=await Team.findOne({country:this.team});
        if(!team)
            return Promise.reject(new Error("Team not Found"));
        const newplayer=new Batter({
            name:this.name,
            runs:this.runs,
            avg:this.avg,
            team:team._id,
            imageUrl:this.imageUrl
        });
        await newplayer.save();
        return Promise.resolve();
    }
    async UpdateAndSave(playerToBeUpd){
        const team=await Team.findOne({country:this.team});
        if(!team)
            return Promise.reject(new Error("Team not Found"));
        //const playerToBeUpd=await Batter.findById(id);
        playerToBeUpd.name=this.name;
        playerToBeUpd.runs=this.runs;
        playerToBeUpd.avg=this.avg;
        playerToBeUpd.team=team._id;
        playerToBeUpd.imageUrl=this.imageUrl;
        await playerToBeUpd.save();
    }
    static async readPlayerById(id){
        const curplayer=await Batter.findById(id).populate('team','country');
        return curplayer;
    }
    static async readAllPlayers(){
        const allPlayers=await Batter.find().populate('team','country');
        //console.log(allPlayers);
        return allPlayers;
    }
    static async deletePlayerById(id)
    {
        const userToBeDel=await Batter.findById(id);
        const imageToBeDel=userToBeDel.imageUrl;
        fs.unlink(imageToBeDel)
            .then(()=>console.log("deleted"))
            .catch((err)=>{
                console.log("ublin");
                const error=new Error(err);
                error.httpStatusCode=500;
                next(error);
            });
        await Batter.findByIdAndDelete(id);
    }
    static async readSomePlayers(curPage,ITEMS_PER_PAGE){
        return await Batter.find().skip((curPage-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).populate('team','country');
    }
    static async getCount(){
        return await Batter.find().countDocuments();
    }

}
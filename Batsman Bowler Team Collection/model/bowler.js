const mongoose=require('mongoose');
const { Team }=require('./team.js');
const Schema=mongoose.Schema;
const bowlerSchema=new Schema({
    name:String ,
    wkts:Number,
    avg: Number,
    imageUrl:String,
    team:{
        type:mongoose.ObjectId,
        ref:'Team'
    }
});

const Bowler=mongoose.model("Bowler",bowlerSchema);

module.exports=class Bowlerx {
    constructor(name,team,wkts,avg,imageUrl){
        this.name=name;
        this.team=team;
        this.wkts=wkts;
        this.avg=avg;
        this.imageUrl=imageUrl;
    }

    async save(){
        const team=await Team.findOne({country:this.team});
        if(!team)
            return Promise.reject(new Error("Team not Found"));
        const newplayer=new Bowler({
            name:this.name,
            wkts:this.wkts,
            team:team._id,
            avg:this.avg,
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
        playerToBeUpd.wkts=this.wkts;
        playerToBeUpd.avg=this.avg;
        playerToBeUpd.team=team._id;
        playerToBeUpd.imageUrl=this.imageUrl;
        await playerToBeUpd.save();
    }
    static async readPlayerById(id){
        const curplayer=await Bowler.findById(id).populate('team','country');
        return curplayer;
    }
    static async readAllPlayers(){
        const allPlayers=await Bowler.find().populate('team','country');
        return allPlayers;
    }
    static async deletePlayerById(id)
    {
        const userToBeDel=await Bowler.findById(id);
        const imageToBeDel=userToBeDel.imageUrl;
        fs.unlink(imageToBeDel)
            .then(()=>console.log("deleted"))
            .catch((err)=>{
                console.log("ublin");
                const error=new Error(err);
                error.httpStatusCode=500;
                next(error);
            });
        await Bowler.findByIdAndDelete(id);
    }
    static async readSomePlayers(curPage,ITEMS_PER_PAGE){
        return await Bowler.find().skip((curPage-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).populate('team','country');
    }
    static async getCount(){
        return await Bowler.find().countDocuments();
    }

}
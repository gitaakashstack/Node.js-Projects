const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const teamSchema=new Schema({
    country:{
                type:String ,
                uppercase:true
            },
    rank:Number
});

const Team=mongoose.model("Team",teamSchema);

Team.countDocuments({}).then(cnt=>{
    if(!cnt)/*checking if the collection doesn't have any document, then we can insert documents because on resaving, nodemon executes the script
    again after modifying and saving any js file, so not checking would create duplicate documents in Team collection*/
    {
        Team.create([
            {
                country:"INDIA",
                rank:2
            },
            {
                country:"SOUTH AFRICA",
                rank:5
            },
            {
                country:"AUSTRALIA",
                rank:3
            },
            {
                country:"ENGLAND",
                rank:4
            },
            {
                country:"NEW ZEALAND",
                rank:1
            },]
        )
        .then((res)=>console.log("created team",res));
    }
})
.catch((err)=>console.log(err,"error in Team.countDocuments"))

exports.Team=Team;


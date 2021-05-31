const mongoose=require('mongoose');
const { Schema,model } = mongoose;
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User = model('User',userSchema);

module.exports=class Userx{
    constructor(email,password)
    {
        this.email=email;
        this.password=password;
    }

    async createUser(){
        const user=new User({
            email:this.email,
            password:this.password
        });
        await user.save();//no need to wait for this operation
        console.log("saved user");
    }

    async findUser(){
        const user=await User.findOne({email:this.email});
        //console.log(user);
        return user;
    }

    static async existsUser(email){
        const exists=await User.exists({email:email});
        return exists;
    }
}
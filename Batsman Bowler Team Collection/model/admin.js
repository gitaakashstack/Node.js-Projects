const mongoose=require('mongoose');
const { Schema,model } = mongoose;
const bcrypt=require('bcrypt');

const adminSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const Admin = model('Admin',adminSchema);
const adminPassword="pass@word";
bcrypt.hash(adminPassword,12)
    .then(hashedPassword=>{
        
        Admin.create([{
            email:'admin1@gmail.com',
            password:hashedPassword
        }])
        .then((res)=>console.log('Admin collection created'))
        .catch(err=>console.log("Admin collection not created"));
    });

module.exports=class Adminx{
    constructor(email,password)
    {
        this.email=email;
        this.password=password;
    }
    async findAdmin(){
        const admin=await Admin.findOne({email:this.email});
        //console.log(user);
        return admin;
    }
}



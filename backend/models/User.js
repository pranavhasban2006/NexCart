const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:true,
        minlength:[6, "Password should be of minimum 6 letters"]
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    }
},      
    {timestamps:true}
);
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});
//match password user eneter to hash pass
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
const User=mongoose.model("User",userSchema);
module.exports=User;
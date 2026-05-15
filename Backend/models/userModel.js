const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please fill a valid email address"],
        unique:[true,"Email already exists"]
    },
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters long"],
        select:false
    },
    role:{
        type:String,
        enum:{
            values:["USER","ADMIN","SYSTEM"],
            message:"Invalid user role"
        },
        default:"USER",
        index:true
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    },
    theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
    },
    activeSessions: [{
        device: String,
        ip: String,
        loginTime: { type: Date, default: Date.now },
        token: String
    }]
},{timestamps:true});

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return;
    }
    try{
        const hash=await bcrypt.hash(this.password,10);
        this.password=hash;
        return;
    }catch(err){
        throw new Error("Error hashing password");
    }
});

userSchema.methods.comparePassword= async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;
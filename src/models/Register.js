require('dotenv').config()
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const { Schema } = mongoose;

const PostSchema = new Schema({
    username: String,
    email:{
        type : String ,
        unique: true
    } ,

    mobile : {
        type:Number,

    },
    password : {
        type : String ,
        minlength:3 ,     
    },
    cpassword : {
        type : String ,
        minlength:3 ,

    },
    url:String ,
    date:{
        type: Date ,
        default :  Date.now 
    },
    tokens:[
        {token:{
            type : String ,
        }}
    ] , 
    cardid: String
    
});

PostSchema.pre("save" , async function(next){
    console.log("hii from inside")

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password , 12)
        this.cpassword = await bcrypt.hash(this.cpassword , 12)
    }

    next();
})


// generating a jwt tokens 

PostSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id : this._id} , process.env.SECREAT_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token ;
        console.log(token)
    } catch (error) {
        console.log(error)
    }
}


const User = mongoose.model("USER", PostSchema);

module.exports = User ;
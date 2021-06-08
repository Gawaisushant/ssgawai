const mongoose = require('mongoose');
const { Schema } = mongoose;

const CardShima = new Schema({
    username: String,
    url: String , 
    titel:String ,
    compay:String , 
    email:{
        type : String ,
    } ,

    mobile : {
        type:Number,

    },
    date:{
        type: Date ,
        default :  Date.now 
    },

    url:String , 
    about:String ,
    website : String ,
    servicesname: String ,
    aboutservice:String ,
 
    
});



const Card = mongoose.model("CARD", CardShima);

module.exports = Card ;
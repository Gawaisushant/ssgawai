const mongoose = require("mongoose");

const url = process.env.MONGO_URL
mongoose.connect(url ,{useCreateIndex : true , useUnifiedTopology : true , useNewUrlParser : true})
.then((e)=> console.log("connect to the mongodb !"))
.catch((e)=> console.log(e))
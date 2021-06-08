require('dotenv').config()
const exprss = require("express");
const app = exprss();
const PORT = process.env.PORT || 4000
app.use(exprss.json())
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require("./src/db/conn");
const User = require("./src/models/Register");
const Card = require("./src/models/card")
const Authenticate = require("./src/auth/auth")
app.get("/" , (req, res) => {
    res.send("welcome to the home page")
});
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.post("/singup" , async(req , res) => {
    const {email, password , cpassword } = req.body ;
    console.log(req.body)
    if (!email || !password || !cpassword  ) {
        return res.status(422).json({error : "plz add all the fields "})
    }else{

        try {
            const userExist = await User.findOne({
                email 
            })
            if (userExist) {
               return res.status(422).json({error : "user is already exist with this email"});
            }
            const user = new User(req.body);
            await user.save();
            return res.status(201).json({success : "user registerd sucesful"})
     
        } catch (error) {
            res.status(422).json({error :"server error"});
            console.log(eror)
        }
    }
})

app.post("/login" ,async(req , res) => {

    const {email , password} = req.body ;
    if (!email || !password) {
        return res.status(400).json({error : "please add all the fields"});
    }

    const userLogin = await User.findOne({email});
    
    if (userLogin) {
        const isMath = await bcrypt.compare(password , userLogin.password);
        const token = await userLogin.generateAuthToken();
        res.cookie("jwtoken" , token , {
            expires : new Date(Date.now() + 25892000000 ),
            httpOnly : true
        });
        console.log(token)
        res.status(201).json({success : "login succssfull"})
    }

    if (!userLogin) {
        return res.status(422).json({error : "Invalide credientials"})
    }
})

app.get("/about" , Authenticate , (req ,res) => {
    console.log("welcome to about us page")
   res.send(req.rootUser);
})

app.get("/card" , Authenticate , (req ,res) => {
    console.log("welcome to card page")
   res.send(req.rootUser);
})

app.get("/logout" , (req ,res ) => {
    res.clearCookie("jwtoken" , {path : "/"});
    res.status(200).send("user logout")
});

// crating card for normal user 

app.post("/cratecard" ,  async (req ,res) => {
    try {
        // const {email , titel , compay , mobile , username , about , services} = req.body ;
        const token = req.cookies.jwtoken
        const newcard = new Card(req.body);

        // adding id to user data 

        const verifyToken = jwt.verify(token, process.env.SECREAT_KEY)
       
        const updated = await User.updateOne({_id:verifyToken._id} , {
            $set : {
                cardid : newcard._id , 
                url : newcard.url
            }
        } , {
            new : true ,
        })

        console.log(updated)

        await newcard.save();
        res.status(200).send("yahoo your card is created");
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error :"the email you enter is already taken by ohter user"})}
     

})

app.post("/usercard/" , async (req , res)=> {
    try {
        console.log("you had clicked submit button")
        const _id = req.body ;
        const response = await Card.findOne({_id});
        console.log(response)
    
        if (response) {
            res.status(200).send(response)
        }else{
            res.status(400).send("not a valide digital card");
            console.log("not a valide user")
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
})

// important for deploying application on herokuapp 

if (process.env.NODE_ENV === "production") {
    app.use(exprss.static("client/build"))
}



app.listen(PORT , console.log(`listning to the port ${PORT}`));



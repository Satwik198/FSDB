const express=require("express");
const mongoose=require("mongoose");
const User=require("./model/User.js");
const dotenv=require("dotenv");
const morgan=require("morgan");
const cors=require("cors");
dotenv.config();


const app=express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("connected to mongodb")})
.catch((err)=>{
    console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
})

app.get("/",(req,res)=>{
    res.status(200).json("server is running");
})
app.post("/signup",async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password)
            return res.status(400).json("email or password not sent");
        let user=await User.findOne({email});
        if(user)
            return res.status(401).json("user already exists");
        user=new User({
            email,password
        })
        await user.save();
        return res.status(200).json("user succesfully regestered");
    }catch(err){
        console.log(err);
        return res.status(500).json("internal server error");
    }
})

app.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(email,password);
        if(!email||!password)
            return res.status(400).json("email or password not sent");
        const user=await User.findOne({email});
        if(!user)
            return res.status(400).json("user dosent  exists");
        if(user.password!=password)
            return res.status(403).json("wrong password");
        return res.status(200).json("login successfull");
    }catch(err){
        console.log(err);
        return res.status(500).json("internal server error");
    }
})
app.listen(5000,()=>{
    console.log("runnng on http://localhost:5000");
})
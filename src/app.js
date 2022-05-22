require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");

const Register = require("./models/registers");
const { response } = require("express");
const port = process.env.PORT||"3000";
/* const static_path = path.join(__dirname,"../public"); */
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");
/* console.log(static_path); */

/* app.use(express.static(static_path)) */
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",async (req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const regsiteremployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirm : cpassword
            })

            const token = await regsiteremployee.generateAuthToken();
            const register = await regsiteremployee.save();
            res.status(201).render("index");
        }else{
            res.send("password sre not getting matched");
        }
       
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

app.get("/login",(req,res)=>{
    res.render("login");
})

/***************** login vaildation *****************/

app.post("/login",async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email})
        const isMatch = await bcrypt.compare(password,useremail.password);
        const token = await useremail.generateAuthToken();
        
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid Password");
        }
        
    } catch (error) {
        res.status(400).send("invalid credentials");
    }
}) 


const jwt = require("jsonwebtoken");

const createToken = async() => {
    const token = await jwt.sign({_id:"628761d5fea33e40d7a5662e"},process.env.SECRET_KEY,{
        expiresIn:"2 hours"
    });
    const userver = await jwt.verify(token, process.env.SECRET_KEY);
}

createToken();

app.listen(port,()=>{
    console.log(`server is runnig at port at ${port}`);
})
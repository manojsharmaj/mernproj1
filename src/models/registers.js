const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
/********** Define schema **********/

const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirm:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

/***************** Generating Tokens ******************/

employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        /* await this.save(); */
        return token;
    } catch (error) {
        res.send("the error part" + error);
    }

}

/**************** Converting password into Hash ****************/

employeeSchema.pre("save",async function(next){
    
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirm = undefined;
    }
    next();
})

/********************** collection creation ***************/

const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/youtubeRegistration",{
    useNewUrlParser:true,
    useUnifiedTopology:true
    /* useFindAndModify:true */
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("no connection",err);
})
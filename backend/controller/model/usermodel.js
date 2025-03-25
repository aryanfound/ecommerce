const mongoose=require('mongoose');
const canvasmodel=require('./canvasmodel');
const documentSchema=mongoose.Schema({title:String,docId:{type:mongoose.Schema.Types.ObjectId,ref:canvasmodel}})
const userschema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        documents:[documentSchema],

        public:[documentSchema],

        private:[documentSchema],

        locked:[documentSchema]
        
    }
)
const usermodel=mongoose.model('user',userschema);
module.exports=usermodel;
const mongoose= require('mongoose');

const questionschema= new mongoose.Schema({
    questiontext:{
        type:String,
        // required:true,
    },
    options:{
        type:[String],
        // required:true,  
    },
    correctoption:{
        type:String,
    },
    level:{
        type:String,
        enum:['easy','medium','hard']
    },
    timer:{
        type:Number,
        default:30,
    },
    marks:{
        type:Number,
    },
    image:{
        type:String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
      },
},{timestamps:true});
const Question=mongoose.model('question',questionschema);
module.exports={Question};
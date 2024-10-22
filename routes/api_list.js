const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path=  require('path');
const multer=require('multer');

const {Question}=require('../model/question');


//  we are seting up the multer for file uploads 

const storage =multer.diskStorage({
    destination:'./uploads/images',
    filename:(request,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

//upload the middleware

// const upload = multer({ storage });
const upload=multer({
    storage:storage,
    limits:{fileSize:1000000000},
    // fileFilter:(request, file, cb)=> {
    //     checkFileType(file,cb);
    // }
});

//create the questions we use the  post method to create the questions

router.post('/',upload.single('image'),async(request,response)=>{
    try{
    const{questiontext,options,correctoption,level,timer,marks}=request.body;
    if (!questiontext || !options || !correctoption || !level || !timer || !marks || !request.file.path) {
        return response.status(400).json({ error: 'All fields are required' });
    }
    const filepath = request.file.path;
        //create a new question
        const question=new Question({
            questiontext,
            options:JSON.parse(options),
            correctoption,
            level,
            timer,
            marks,
            image:filepath,
        });
        await question.save();
        response.status(201).json({
            message: 'Question created successfully',
            question,
            imageUrl: filepath // Include the image URL in the response
        });
    }catch(error){
        response.status(400).json({
            error:'failed to create a question',details:error
        });
    }
});

//get all question to use get method 
router.get('/:id',async(request,response)=>{
    try{
        const quest=await Question.findById(request.params.id);
        if(!quest){
            return response.status(200).json({error:'question not found'});
        }
        response.json(quest);
    }
    catch(error){
        response.status(500).json({ error: 'Failed to fetch questions' });
    }
});

//get a question by id
//we use the get method

router.get('/level/:level',async(request,response)=>{
    const level=request.params.level;
    if(!['easy','medium','hard'].includes(level)) {
        return response.status(404).json({error:'invalid level it miust be easy,mediumor hard'});
    }
    try
        { 
           const questions=await Question.find({level});
           response.json(questions);
    }

    catch(error){
        response.status(500).json({ error: 'Failed to load a question' });
    }

});

// update a question by id 
// for updation we use a put method

router.put('/:id',async(request,response)=>{
    try{
        const{questiontext,options,correctoption,level,timer,marks,image}=request.body
        const question=await Question.findByIdAndUpdate(request.params.id,
            {questiontext,options,correctoption,level,timer,marks,image},
            {new:true}
        );
        if(!question) return response.status(404).json({error:'question not found'});
        
        
        if(questiontext) question.questiontext=questiontext;
        if(options) question.options=options;
        if(correctoption) question.correctoption=correctoption;
        if(level) question.level=level;
        if(timer) question.timer=timer;
        if(marks) question.marks=marks;
        if(request.file) question.image='/uploads/images/${request.file.filename}';

        await question.save();
        response.json(question);
    }
    catch{
        response.status(500


        ).json({message:error.message});
    }
});

//delete a question by id

router.delete('/:id',async(request,response)=>{
    const question = await Question.findByIdAndDelete(request.params.id);
    try{
        
        if (!question) return response.status(404).json({ error: 'Question not found' });
        response.json({ message: 'Question deleted successfully' });
    }
    catch{
        response.status(500).json({message:err.message})
    }
});
module.exports = router;




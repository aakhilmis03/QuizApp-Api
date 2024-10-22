const mongoose= require('mongoose');
const express =require('express');
const bodyParser = require('body-parser');
const path=require('path');
const  port = 3000;
const usersroute=require('./routes/api_list');


const app = express();

app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

mongoose.connect('mongodb://localhost:27017/quiz',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB is connected'))
.catch(error => console.log(error));



app.use(bodyParser.json());
app.use('/api/questions', require('./routes/api_list'));

// start the server 
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

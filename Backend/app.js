const express = require('express')
const bodyParser = require('body-parser')
const placeRoutes = require('./routes/places-route');
const userRoutes = require('./routes/users-route')
const mongoose = require('mongoose')
const fs =require('fs')
const path = require('path')
const app = express();
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
    next();
})

app.use('/uploads/images',express.static(path.join('uploads','images')))

app.use('/api/places', placeRoutes);
app.use('/api/users',userRoutes)

app.use((req,res,next)=>{
    const error = new Error('Could not find the url');
    error.code= 404
    throw error
})
app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,err=>{
            console.log(err)
        })
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message||'An unknown error occured'})
})

const url = "mongodb+srv://samarth:samarth@cluster0.eqcxard.mongodb.net/appdata?retryWrites=true&w=majority";
mongoose
.connect(url)
.then(()=>{app.listen(5000)})
.catch((e)=>{console.log(e)})


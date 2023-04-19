const Place = require('../models/places-schema');
const User = require('../models/users-schema')
const { Error } = require('mongoose');
const mongoose = require('mongoose')
const fs = require('fs')

const getPlaceByID =async(req,res,next)=>{
    const id = req.params.pid
    let place;
    try{
        place = await Place.findById(id).exec()
    }catch (e){
        const error = new Error('Something went wrong could not find.');
        error.code= 500;
        return next(error)
    }
    

    if(!place){
        const error = new Error('Could not find a place for the provided id.');
        error.code= 404
        return next(error)
    }

    console.log('GET request getPlaceByID');
    res.json({place:place.toObject({getters:true}) })
}

const getPlacesByUserID=async(req,res,next)=>{
    const id = req.params.uid
    let places
    try{
        places = await Place.find({creator:id}).exec();
    }catch (e){
        const error = new Error('Something Went Wrong')
        error.code = 500
        return next(error)
    }

    if(!places||places.length===0){
        const error = new Error('User Has Not Listed any Places');
        error.code= 404
        return next(error)
    }

    console.log('GET request in Places for uid');
    res.json({places:places.map(p=>p.toObject({getters:true}))})
}

const createPlace=async(req,res,next)=>{
    const {title,description,address,creator } =req.body;
    const createdPlace=new Place({
        title,description,
        image:req.file.path,
        address,creator
    })

    let user;
    try{
        user = await User.findById(creator).exec()

    } catch(e){
        const error = new Error('Creating Place Failed')
        error.code =500
        return next(error)
    }
    if(!user){
        const error = new Error('Could not find user with id')
        error.code =404
        return next(error)
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session:sess});
        user.places.push(createdPlace);
        await user.save({session:sess});
        await  sess.commitTransaction();
    }catch(e){
        const error = new Error('Creating Place Failed')
        error.code =500
        return next(error)
    }
    res.status(201).json(createdPlace)
}

const updatePlaceByID = async (req,res,next)=>{
    const {title,description} =req.body;
    const id = req.params.pid;
    let place;
    try{
        place = await Place.findById(id).exec()
    }catch (e){
        const error = new Error('Something went wrong could not update.');
        error.code= 500;
        return next(error)
    }


    place.title = title;
    place.description=description;
    try{
        await place.save();
    }catch (e){
        const error = new Error('Something went wrong could not save update.');
        error.code= 500;
        return next(error)
    }
    res.status(200).json({place:place.toObject({getters:true})})

}

const deletePlace=async (req,res,next)=>{
    const id = req.params.pid
    let place;
    
    try{
        place = await Place.findById(id).populate('creator');    
    }catch (e){
        const error = new Error('Something went wrong could not delete.');
        error.code= 500;
        return next(error)
    }

    if(!place){
        const error = new Error('could not find place with id');
        error.code= 404;
        return next(error)
    }
    const imagePath = place.image

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session:sess });
        place.creator.places.pull(place);
        await place.creator.save({ session:sess});
        await sess.commitTransaction();
    }catch (e){
        const error = new Error('Something went wrong could not remove.');
        error.code= 500;
        return next(error)
    }
    fs.unlink(imagePath,err=>{
        console.log(err)
    })
    res.status(200).json({message:"deleted"})
}





exports.getPlaceByID= getPlaceByID;
exports.getPlacesByUserID=getPlacesByUserID;
exports.createPlace=createPlace;
exports.updatePlaceByID=updatePlaceByID;
exports.deletePlace=deletePlace;
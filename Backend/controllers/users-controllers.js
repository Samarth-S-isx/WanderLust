const User= require('../models/users-schema')


const getUsers = async (req,res,next)=>{
    let users;
    try{
        users = await User.find({},'-password');
    } catch(err){
        const error = new Error('Fetching user failed,please try again later')
        error.code = 500
        return next(error)
    }
    res.json({users:users.map(user=>user.toObject({getters:true}))})
};


const signup = async(req,res,next)=>{
    const {name,email,password} = req.body;
    if(name.length===0){
        const error = new Error("Invalid Credentials up failed")
        error.code = 500
        return next(error)
    }
    let existingUser;
    try{
        existingUser = await User.findOne({email:email} )
    }catch (e){
        const error = new Error("Signing up failed")
        error.code = 500
        return next(error)
    }
    if(existingUser){
        const error = new Error("Email ID already Exists")
        error.code = 422
        return next(error)
    }
    
    const newUser = new User({
        name,email,password,image:req.file.path,
        places:[]
    })
    // try{
    //     await newUser.save()
    // }catch(e){
    //     const error = new Error("Saving Failed")
    //     error.code = 500
    //     return next(error)
    // }
    await newUser.save()

    res.status(201).json({user:newUser.toObject({getters:true})});
}

const login = async (req,res,next)=>{
    const {email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email} )
    }catch (e){
        const error = new Error("Logging up failed")
        error.code = 500
        return next(error)
    }

    if(!existingUser || existingUser.password!== password){
        const error = new Error("Invalid credentials")
        error.code = 401
        return next(error) 
    }
    res.json({message:"Logged in",user:existingUser.toObject({getters:true})})
}


exports.getUsers=getUsers
exports.signup=signup
exports.login = login
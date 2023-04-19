const { v4: uuid } = require('uuid');
const multer = require('multer')

const MIME_TYPE={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}


const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,'uploads/images')
        } ,
        filename: (req,file,cb)=>{
            const ext=  MIME_TYPE[file.mimetype];
            cb(null,uuid()+'.'+ext)
        }

    })
})


module.exports = fileUpload;
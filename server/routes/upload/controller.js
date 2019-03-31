const repo = require('./repository');
const fs = require('fs-extra');
const cloudinary = require('cloudinary').v2;

module.exports.homeView = async (req, res, next) => {
    try {
        const images = await repo.getTopImages(10);
        res.render('upload/images', { images });
    }
    catch(err){
        next(err);
    }
};

module.exports.addView = async (req, res, next) => {
    try {
        const images = await repo.getAllImages();
        res.render('upload/upload', { images });
    }
    catch(err){
        next(err);
    }
};

module.exports.create = async (req, res, next) => {
    //req.file added by multer
    const imagePath = req.file.path;
    const { title, description } = req.body;

    try {
        const { url, public_id } = await cloudinary.uploader.upload(imagePath);
        await repo.addImage({ title, description, url, public_id });
        await fs.unlink(imagePath);
        res.redirect('/add');
    }
    catch (err) {
        next(err);
    }
};

module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    try {
        const image = await repo.deleteImage(id);
        if(image){
            await cloudinary.uploader.destroy(image.public_id);
            res.redirect('/add');
        }
        else
            res.badRequest({ message: 'No such image' });
    }
    catch(err){
        next(err);
    }
};
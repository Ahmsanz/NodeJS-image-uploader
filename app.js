const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Initialize upload 
const upload = multer({
    storage,
    limits: { fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single('myImage')

// Check file type

const checkFileType = (file, cb) => {
    // allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;
    // check ext
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // check mime
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extName) {
        return cb(null, true)
    } else {
        cb('Error: images only!');
    }
    
}

// initialize application
const app = express();

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

// Set EJS as engine
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    // upload is the multer method previously defined;
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        }else {
            console.log(req.file);
            res.send('test');
        }
    })
})
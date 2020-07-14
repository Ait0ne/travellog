const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const uploader  = require('s3-batch-upload');
const sharp = require('sharp');
const path = require('path');
const fsExtra = require('fs-extra');
const AWS=require('aws-sdk');

if (process.env.NODE_ENV !== 'production') require('dotenv').config()
try{
    fs.mkdirSync(path.join(__dirname, 'avatars'))
} catch {
    
}


const s3 = new AWS.S3();

const storage = multer.diskStorage({
    destination: path.join(__dirname,'uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage});

try{
    fs.mkdirSync(path.join(__dirname, 'uploads/photos'))
} catch {
    
}

const app = express();

const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: ['http://radiant-reef-63518.herokuapp.com', 'http://localhost:3000']
}));


if (process.env.NODE_ENV==='production') {
    app.use(express.static(path.join(__dirname, 'travellog/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'travellog/build', 'index.html'))
    })
}


app.post('/images', upload.array('file'), async (req, res) => {
    const {placeId, userId, avatar} = req.body
    const images = req.files
    let files = null
    await Promise.all(images.map(image => {
        return sharp(image.path)
        .resize(300,300)
        .toBuffer()
        .then( data => {
            return fs.writeFile(path.join(__dirname,`${avatar?'avatars':'uploads/photos'}/medium-${image.originalname}`), data, (err) => {
                if (err) {
                    console.log('1',err)
                }
            })
        })
        .catch(err => {
            console.log('2', err)
        })
    }))

    if (!avatar) {
        await Promise.all(images.map(image => {
            return sharp(image.path)
            .resize(2560,null, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toBuffer()
            .then( data => {
                return fs.writeFile(path.join(__dirname,`${avatar?'avatars':'uploads/photos'}/${image.originalname}`), data, (err) => {
                    if (err) {
                        console.log('1',err)
                    }
                })
            })
            .catch(err => {
                console.log('2', err)
            })
        }))
    }

    files = await new uploader.default({
        bucket:'travellogserverbucket',
        localPath: path.join(__dirname,`${avatar?'avatars':'uploads/photos'}`),
        remotePath: `${userId}/${avatar? 'avatar':placeId}`,
        glob: '*.jpg',
        accessControlLevel:'public-read'
    }, ).upload()
    fsExtra.emptyDir(path.join(__dirname,'uploads'))
    fsExtra.emptyDir(path.join(__dirname,'avatars'))
    if (files) {
        res.status(200).json({files:files})
    } else {
        res.status(400).json('Error uploading files')
    }
})

app.post('/deleteImage', (req, res) => {
    const {userId, placeId, imageId} = req.body
    s3.deleteObjects({
        Bucket: 'travellogserverbucket',
        Delete: {
            Objects: [
                {Key: `${userId}/${placeId}/${imageId}`},
                {Key: `${userId}/${placeId}/medium-${imageId}`}
            ]
        }
    },(err, data) => {
        if (err) {
            console.log(err)
            res.status(400).send('Error Deleting File')
        }
        console.log(data)
        res.status(200).send({ok: true})

    })
})




app.listen(port, err => {
    if (err) throw err
    console.log('server is running on port ', port)        
})


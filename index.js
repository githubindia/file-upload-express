// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();

// var port = process.env.PORT || 3000;

// /**
//  * To support JSON-encoded bodies.
//  */
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html")
// })

// app.post('/images', (req, res) => {
//     console.log(req.files);
//     res.end("hello");
// })

// app.listen(port);
// console.log("Server Running Successfully at port " + port);

// module.exports = app;

var express =   require("express");  
var multer  =   require('multer');  
var app =   express();
var fs = require("fs");
var request = require("request");
var cloudinary = require('cloudinary');
var path = require('path');
require('dotenv').config()


cloudinary.config({ 
  cloud_name: 'hexai', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var image;

var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {
      image = file.originalname;
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }  
});  
var upload = multer({
    storage : storage,
    limits: 10000000,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('img');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

var port = process.env.PORT || 3000
  
app.get('/',function(req,res) {  
      res.sendFile(__dirname + "/index.html");
});
  
app.post('/images',function(req,res) {
    upload(req, res, function(err) {
        if(err) {
            return res.end(err);
        } else {
              res.end("File is uploaded successfully!");;
              cloudinary.uploader.upload(req.file.path, function(result) {
                console.log(req.file)
                console.log(result);
                    //create an urembo product
                    //save the product and check for errors
                });
            // var options = { 
            //     method: 'POST',
            //     url: 'https://api.deepai.org/api/colorizer',
            //     headers: {
            //         'api-key': process.env.API_KEY,
            //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            //     },
            //     formData: {
            //         image: {
            //             value: `fs.createReadStream(/uploads/${image})`,
            //             options: {
            //                 filename: `uploads/${image}`, contentType: null
            //             }
            //         }
            //     }
            // };
            // request(options, function (error, response, body) {
            //   if (error) throw new Error(error);

            //   console.log(body);
            //   res.end("File is uploaded successfully!");
            // });
        }
    });  
});
app.listen(port, function(){  
    console.log("Server is running on port: " + port);  
});
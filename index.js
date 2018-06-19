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
require('dotenv').config()

var image;
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {
      image = file.originalname;
    callback(null, file.originalname);
  }  
});  
var upload = multer({ storage : storage}).single('img');  
  
app.get('/',function(req,res) {  
      res.sendFile(__dirname + "/index.html");
});  
  
app.post('/images',function(req,res){  
    upload(req, res, function(err) {  
        if(err) {  
            return res.end("Error uploading file." + err);  
        } else {
            res.end("File is uploaded successfully!");
            var options = { 
                method: 'POST',
                url: 'https://api.deepai.org/api/colorizer',
                headers: {
                    'api-key': process.env.API_KEY,
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
                formData: {
                    image: {
                        value: `fs.createReadStream(/uploads/${image})`,
                        options: {
                            filename: `uploads/${image}`, contentType: null
                        }
                    }
                }
            };
            request(options, function (error, response, body) {
              if (error) throw new Error(error);

              console.log(body);
            });
        }
    });  
});  
  
app.listen(3000,function(){  
    console.log("Server is running on port 3000");  
});
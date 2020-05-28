
var http = require('http');
const fs = require('fs');
var path = require('path');
var multer  = require('multer');
var dedupe = require('dedupe');
var uniqs = require('uniqs');
var infusion = require('dedupe-infusion');
var xlsxj = require("xlsx-to-json");
const express = require('express');
var app = express();
var upload = multer({ dest: 'uploads/' })


app.use(express.urlencoded())
console.log(__dirname);
app.use(express.static(__dirname ));
app.listen(8000,() => console.log("Server is running"));



app.post('/sub-form',upload.single('rfile'),(req,res) => {

     console.log(req.body.rfile);
     var file_name=req.body.rfile;
     xlsxj({
       input: file_name,
       output: "output.json"
     }, function(err, result) {
       if(err) {
         console.error(err);
       }else {
         // console.log(result);
       }
     });

    let rawdata = fs.readFileSync("output.json");
    let data = JSON.parse(rawdata);
    var l1 = data.length;
    var d1 = new Date();
    var n1 = d1.getTime();
    let rdata = dedupe(data);
    // console.log(rdata);
    var d2 = new Date();
    var n2 = d2.getTime();
    var t = n2-n1;
    var l2 = rdata.length;
    var noDupli = l1 - l2;

    console.log("Time difference " + t);
     let data_new = JSON.stringify(rdata,null,2);
     console.log(l1);
     console.log(l2);

     console.log("no. of duplicate records : " + noDupli);


    fs.writeFile('final_data.json',"Data  :  "+ data_new +" {Duplicate Records : "+ noDupli +"}          {Time Taken :  "+ t +"ms}", (err) => {
       if (err) throw err;
       console.log('Data written to file');
       res.sendFile(path.join(__dirname +'/final_data.json'));
   });

});

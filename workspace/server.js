var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var http = require('http');
var server = http.createServer(app);
var fs = require("fs");

var idNum = 0;

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Process application/json
app.use(bodyParser.json());


app.post('/myAction', function(req, res){  
//now req.body will be populated with the object you sent

  var json = req.body;
  var print = JSON.stringify(json,null,4);
  
  console.log(print);
  
  
  
  //Validation
  var form = JSON.parse(print);
  
  var data = fs.readFileSync("./client/js/trasktest1.json","utf8");
  var jsonSchema = JSON.parse(data);
  
  var endPage = "";
  
    
    var Ajv = require('ajv');
    var ajv = Ajv({allErrors: true});
    ajv.addMetaSchema(require('./node_modules/ajv/lib/refs/json-schema-draft-06.json'));
    var valid = ajv.validate(jsonSchema, form);
    
    if (!valid) {
      console.log(ajv.errors);
      endPage = ('<html><body><h1>Invalid form input</h1><br><form><input type="button" value="Back home" onclick="window.location.href=\'https://trask-test-zadani-lordwizardy.c9users.io/index.html\'" /></form></body></html>');
    } else {
      
      //Writing to file
      idNum += 1;
  
      req.body.id = parseInt(req.body.id, 10);
      req.body.id += idNum;
      req.body.id = String(req.body.id);
      json = req.body;
      print = JSON.stringify(json,null,4);
      
      var fileContent = print;
      
      fs.writeFile("./client/forms/formResult"+idNum+".json", fileContent, "utf8", (err) => {
          if (err) {
              console.error(err);
              return;
          }
          console.log("File has been created");
      });
      endPage = ('<html><body><h1>Form sent</h1><br><form><input type="button" value="Back home" onclick="window.location.href=\'https://trask-test-zadani-lordwizardy.c9users.io/index.html\'" /></form></body></html>');
      
    }
  
  res.send(endPage);
  
  // res.send('<html><body><h1>Form sent</h1><br><form><input type="button" value="Back hom" onclick="window.location.href=\'https://trask-test-zadani-lordwizardy.c9users.io/index.html\'" /></form></body></html>');

});



//Zobrazování formulářů

var formsCont = "";

//
app.post('/forms', function(req, res){
  
  const testFolder = './client/forms/';

  fs.readdir(testFolder, (err, files) => {
    if (err) {
                console.error(err);
                return;
            }
    files.forEach(file => {
      console.log(file);
      
      var x = fs.readFileSync('./client/forms/' + file, "utf8");
      console.log(x);
      formsCont += x;
      
    });
    
    console.log(formsCont);
    //res.end('<html><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head><body>' + formsCont + '</body></html>');
    res.end(formsCont);
  });
  
  
});


//Setting up server
app.use('/', express.static(__dirname + '/client')); // ← adjust

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});



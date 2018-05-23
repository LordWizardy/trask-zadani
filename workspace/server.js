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

  idNum += 1;
  
  req.body.id = parseInt(req.body.id, 10);
  req.body.id += idNum;
  var json = req.body;
  var print = JSON.stringify(json,null,4);
  
  console.log(print);
  
  
  //Validation
  fs.readFile("./client/js/trasktest1.json", (err, data) => {
    if (err) throw err;
    console.log("File red");
    
    var userSchema = data;
    var user = req.body;
    
    var Ajv = require('ajv');
    var ajv = Ajv({allErrors: true});
    var validate = ajv.compile(userSchema);
    var valid = validate(user);
    if (valid) {
      console.log('User data is valid');
      
      //Writing to file
  
        var fileContent = print + ", ";
        
        fs.writeFile("./client/forms/formResult"+idNum+".json", fileContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("File has been created");
        });
        
  
      
    } else {
      console.log('User data is INVALID!');
      console.log(validate.errors);
    }
  });

  res.send('<html><body><h1>Formulář odeslán</h1><br><form><input type="button" value="Back home" onclick="window.location.href=\'https://trask-test-zadani-lordwizardy.c9users.io/index.html\'" /></form></body></html>');

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
      
      var x = fs.readFileSync('./client/forms/' + file, {encoding: "utf8"});
      console.log(x);
      formsCont += x;
      
    });
    
    console.log(formsCont);
    res.end(formsCont);
  });
  
  
});


//Setting up server
app.use('/', express.static(__dirname + '/client')); // ← adjust

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});



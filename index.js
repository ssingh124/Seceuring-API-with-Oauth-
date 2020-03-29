let express = require('express');
let app = express();
const fetch = require('node-fetch');
let sqlite = require('sqlite');


function setupServer(db) {

    // This is a test frontend - uncomment to check it out
    app.use(express.static('public'));
    
    //First Route

    app.use('/info', function (req, res, next) {
   
const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1];

 //Checking if token is right or not
 fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`).then(function(response) {
 return response.json();
 }).then(data =>{

//if token is not right send an error message
 if(data.error){
res.status(401).send("Error 401: Unauthorized access")
 }
//otherwise send to next() to print data
 else{
 next()
 }
 
 }).catch(error =>{
 
  res.status(401).send("Error 401: Unauthorized access")
 })
 
}, (req, res) => {
        res.send('Full stack EXAMPLE');
    });




//Second route


    // retrieve all unique stree names
    app.use('/streets',
 function (req, res, next) {
   
const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1];

 
 fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`).then(function(response) {
 
 return response.json();
 }).then(data =>{

 if(data.error){
  res.status(401).send("Error 401: Unauthorized access")
 }
 else{
 next()
 }
 
 }).catch(error =>{
 console.log(error)
  res.status(401).send("Error 401: Unauthorized access")
 })
 

},  (req, res) => {
        db.all(`SELECT DISTINCT(name) FROM BikeRackData`)
          .then( data => {
              console.log(data);
              res.send(data);
          });
    });


//Third Route

    app.use('/streets/:street/',
function (req, res, next) {
   
 const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1];

 fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`).then(function(response) {
 


 return response.json();
 }).then(data =>{

 if(data.error){
  res.status(401).send("Error 401: Unauthorized access")
 }
 else{

 next()
 }
 
 }).catch(error =>{

 console.log(error)
 res.status(401).send("Error 401: Unauthorized access")
 })
 




}, (req, res) => {
        let streetName = req.params.street;
        // query based on street
        // NOTE: this is open to SQL injection attack
        db.all(`SELECT * FROM BikeRackData WHERE name = '${streetName}'`)
          .then( data => {
              res.send(data);              
          });
        

    });

    

    let server = app.listen(8080, () => {
        console.log('Server ready', server.address().port);
    });
    
}
sqlite.open('database.sqlite').then( db => {
        //console.log('database opened', db);

    setupServer(db);
    //return db.all('SELECT * from TEST');
    
})


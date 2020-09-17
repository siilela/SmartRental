const express =require('express');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const nodemailer =require('nodemailer');
const path = require('path');
const app=express();
const router = express.Router();
const browserPort = process.env.PORT || 4000;
const cfenv = require('cfenv');

//CF enviornment Variables
const oAppEnv=cfenv.getAppEnv();

//MongoDB
var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
//var url=oAppEnv.services.mongodb[0].credentials.uri;


//View Engine Setup
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

//Static Folder

app.use('/', express.static(path.join(__dirname, 'public')));

//Require
//require('users.js')(app);

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//var path = require('path');
var mime = require('mime');

const mongoose=require('mongoose');

mongoose.Promise=global.Promise;

/**module.exports = function(oAppEnv)
{
    if(oAppEnv.isLocal=== true){
        mongoose.connect('mongodb://localhost:27017/');
    }
    else
    {
      mongoose.connect(oAppEnv.services.mongodb[0].credentials.uri);
    }
} **/


     // var vcap_services = JSON.parse(process.env.VCAP_SERVICES); // Get Environment variables from your App ; more at https://docs.developer.swisscom.com/apps/deploy-apps/environment-variable.html
      //var uri = vcap_services.mongodb[0].credentials.uri; // Get the URI with the credentials
            /*
      * Gather  all requests from /
      */

     if(process.env.VCAP_SERVICES){
      var env = JSON.parse(process.env.VCAP_SERVICES);
      //var mongo = env['mongodb-1.8'][0]['credentials'];
      var mongo =oAppEnv.services.mongodb[0].credentials.uri;

      app.get('/', function (req, res) { // telling nodeJs to get all commands from / into this function
        /* Connect to MongoDB */
        MongoClient.connect(mongo, function(err, db) { // connect to the local Database
        res.writeHead(200,{"Content-Type" : "text/html"}); // write header

          res.write('<h1>How is Siilela ? </h1>');
          if(err) { throw err; } // check if connection is ok, else err-output

          db.collection("bookings").findOne(function(err, output) {  // finds the first object/temperature
          res.write('Hello World! <br><hr> The inumber is '+ output.inumber +' today');
        res.end();
        db.close(); // close the Database connection
          });
        });
      });
    }
    else
    {
      var mongo = {"hostname":"localhost","port":53770,"db":"smartRental"}
      app.get('/', function (req, res) { // telling nodeJs to get all commands from / into this function
        /* Connect to MongoDB */
        MongoClient.connect("mongodb://localhost:27017/smartRental", function(err, db) { // connect to the local Database
        res.writeHead(200,{"Content-Type" : "text/html"}); // write header

          res.write('<h1>How is Siilela ? </h1>');
          if(err) { throw err; } // check if connection is ok, else err-output

          db.collection("bookings").findOne(function(err, output) {  // finds the first object/temperature
          res.write('Hello World! <br><hr> The inumber is '+ output.inumber +' today');
        res.end();
        db.close(); // close the Database connection
          });
        });
      });
    }
   
    if(process.env.VCAP_SERVICES){
      var env = JSON.parse(process.env.VCAP_SERVICES);
      //var mongo = env['mongodb-1.8'][0]['credentials'];
      var mongo =oAppEnv.services.mongodb[0].credentials.uri;

      app.post('/send1',(req,res)=>{


        var inumber= "i22222";
        var name= "Tshidi";
        var email="sssss";
        var bookDate="2016";
        var comments="Do This";
      
      
        MongoClient.connect(mongo, function(err, db) {
          if (err) throw err
          var dbo = db.db("smartRental");
          var myobj = { inumber: inumber, name:name ,email:email,date:bookDate,comments:comments};
          dbo.collection("bookings").insertOne(myobj, function(err, res) {
            if (err) throw err;
      
      
      
      
            console.log("1 document inserted");
            db.close();
          });
        });
      
      })
    }
    else
    {
      app.post('/send1',(req,res)=>{


        var inumber= "i22222";
        var name= "Tshidi";
        var email="sssss";
        var bookDate="2016";
        var comments="Do This";
      
      
        MongoClient.connect("mongodb://localhost:27017/smartRental", function(err, db) {
          if (err) throw err
          var dbo = db.db("smartRental");
          var myobj = { inumber: inumber, name:name ,email:email,date:bookDate,comments:comments};
          dbo.collection("bookings").insertOne(myobj, function(err, res) {
            if (err) throw err;
      
      
      
      
            console.log("1 document inserted");
            db.close();
          });
        });
      
      })
    
    
    }
   






/*
 * Gather  all requests from /
 */
app.get('/', function (req, res) { // telling nodeJs to get all commands from / into this function
    /* Connect to MongoDB */
	MongoClient.connect( "mongodb://localhost:27017/smartRental" , function(err, db) { // connect to the local Database
		res.writeHead(200,{"Content-Type" : "text/html"}); // write header

	  	res.write('<h1>How is the weather ? </h1>');
	  	if(err) { throw err; } // check if connection is ok, else output

	  	db.collection("smartRental").findOne(function(err, output) {  // finds the first object/temperature
	    	res.write('Hello World! <br><hr> The weather is '+ output.bookings +' today');
		  	res.write('<br><hr><form action=\'/temp\'><h3>Change weather</h3><br><input type=text name=temp value=hot><br><input type=submit value=\'Change the weather...\'></form>'); // add a simple inputfield
			res.end();
			db.close(); // close the Database connection
	  	});
    });
});

/*
 * Gather all requests from /temp
 */
app.get('/temp', function (req, res) { // telling nodeJs to get all commands from /temp into this function

 	/* Connect to MongoDB */
	mongoClient.connect( "mongodb://localhost:27017/smartRental" , function(err, db) { // connect to the local database
	  	if(err) { return console.dir(err); } // check if connection is ok, else output

	  	db.collection('bookings').drop(); // drop the collection if existing
  		db.collection('bookings').insert( {"inumber": req.query.temp } ) // add a new object with "temperature"
		res.send("done <hr> <a href=\'/\'>back</a>");
		res.end();
  		db.close(); // close the Database connection
  	});
});



    //const User =require(user.js);

    app.get('/user',function(req, res){
        User.find(function(err,users){
            if(err)
            {
                return res.status(500).send('Error Occured :DB error');
            }

            res.json(users.map(function (user){
              return
              {
                  inumber: bookings.inumber

              };

              }));
            });
            });

       app.get('user/:id',function(req, res){
        User.find({id: req.param.id},function(err,users){
            if(err|| user===null)
            {
                return res.status(500).send('Error Occured :DB error');
            }

            res.json({

              inumber:bookings.inumber,
             name: bookings.name,
             email: bookings.email

        });



       });

   });



app.get('/', (req,res)=>
{
    res.render('index');
});
app.get('/linkPdf', function(req, res){

/*  var file = __dirname + '/upload-folder/dramaticpenguin.MOV';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);**/

  res.render('linkPdf');
});
app.get('/second', function(req, res) {
    res.render('portfolio-alt2-4cols');
});
app.get('/showcase1', function(req, res) {
    res.render('showcase1');
});
app.get('/showcase2', function(req, res) {
    res.render('showcase2');
});
app.get('/showcase3', function(req, res) {
    res.render('showcase3');
});
app.get('/showcase4', function(req, res) {
    res.render('showcase4');
});

app.get('/showcase5', function(req, res) {
    res.render('showcase5');
});

app.get('/showcase6', function(req, res) {
    res.render('showcase6');
});

app.get('/showcase7', function(req, res) {
    res.render('showcase7');
});
app.get('/showcase8', function(req, res) {
    res.render('showcase8');
});

///Reports

/**app.get('/reports',(req,res)=>{

 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("smartRental");
  //Find all documents in the customers collection:
  dbo.collection("bookings").find({}).toArray(function(err,result) {
    if (err) throw err;
    console.log(result);

    db.close();
    res.render('reports',{collection: JSON.stringify(result)});

      //"RESULT: "+JSON.stringify(result))
    //res.render();
    //('showcase1',{msg:'Email has been sent'})
  });


});

      //handle err, then you can render your view
      //res.render('/reports',{collection: result});


    //  res.render('reports');

});  **/





app.post('/send',(req,res)=>{

  var inumber= req.body.inumber;
  var name= req.body.name;
  var email=req.body.email;
  var bookDate=req.body.date;
  var comments=req.body.comments;


  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    var dbo = db.db("smartRental");
    var myobj = { inumber: inumber, name:name ,email:email,date:bookDate,comments:comments};
    dbo.collection("bookings").insertOne(myobj, function(err, res) {
      if (err) throw err;




      console.log("1 document inserted");
      db.close();
    });
  });

  const output=`


                  <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                  <title>Untitled Document</title>
                  </head>

                  <body>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" valign="top" bgcolor="#f5d500" style="background-color:#f5d500;"><br>
                      <br>
                      <table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" valign="top" bgcolor="#fedd02" style="background-color:#fedd02; padding:6px;"><table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin-bottom:10px;">
                            <tr>
                              <td align="center" valign="top"><img src="Logo.png" width="298" height="67" style="display:block;"></td>
                            </tr>
                          </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="5" style="margin-bottom:20px;">
                              <tr>
                                <td align="center" valign="top" bgcolor="#000000" style="background-color:#000000; color:#ffffff; font-family:Verdana, Geneva, sans-serif; font-size:11px;">SHOWCASE SUCCESSFULLY BOOKED &nbsp;&nbsp;</td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin-bottom:10px;">
                              <tr>
                                <td align="center" valign="top" style="color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:38px;">SHOWCASE BOOKED</td>
                                </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
                              <tr>
                                <td align="center" valign="top"><img src="images/divider1.png" width="587" height="6" style="display:block;"></td><br>
                                <h3>Congratulations ,You have booked showcase</h3>
                                <h3>User Details</h3>

                                   <p>inumber : ${req.body.inumber}</p>
                                    <p>name : ${req.body.name}</p>
                                    <p>email : ${req.body.email}</p>
                                    <p>Date(From -To) : ${req.body.date}</p>


                                  <p>Comments : ${req.body.comments}<\p>

                              </tr>

                            </table></td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin-bottom:10px;">
                              <tr>
                                <td align="center" valign="top" style="color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:38px;"><a href="http://localhost:4000/">GO TO HOME PAGE</a></td>
                              </tr>
                            </table>

                  </body>
                  </html>

  `

  // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'silelauriah@gmail.com',// generated ethereal user
            pass: 'Cuzi@2016'// generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {

        from: '"SHOW CASE BOOKED" <DoNotReply@sap.com>', // sender address
        to:req.body.email,// list of receivers
        subject: 'SHOW CASE BOOKED ', // Subject line
        text: 'Booked showcase', // plain text body
        cc: "siilela.mogashoa@sap.com",
        bcc:"glenmasemene@gmail.com",
        html: output// html body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('showcase1',{msg:'Email has been sent'})('showcase2',{msg:'Email has been sent'});
    //,'showcase2',{msg:'Email has been sent'},'showcase3',{msg:'Email has been sent'},'showcase4',{msg:'Email has been sent'});
    });
});



});
//app.listen(browserPort,()=>console.log('Server Started'));

//Express App listener

//app.listen(oAppEnv.port,()=>console.log('Server Listening at '+oAppEnv.url));

var port = process.env.PORT || 3000; // either use the port 3000 or a port which is in the "environment variable" - the cloud will deliver us such a port
app.listen(port); // tell nodejs to listen to this port and give response

console.log('I am ready and listening on %d', port); // write something nice in the console, that the Developer sees, it works

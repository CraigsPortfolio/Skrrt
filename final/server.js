var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/profiles";
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
var currentUser = "";
// //this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({
  secret: 'example'
}));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var db;


//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening on 8080');
});

//Displays the root page (Our landing page, 'index')
app.get('/', function(req, res) {
  res.render('pages/index', {
    user: currentUser
  });
});

//Displays the main page
app.get('/main', function(req, res) {
  res.render('pages/main', {
    user: currentUser
  });
});

//Displays the register page
app.get('/register', function(req, res) {
  res.render('pages/register', {
    msg: "" //Initialises the username present error message
  });
});

//Displays the profile page
app.get('/profile', function(req, res) {
  //Check if the user is logged-in
  if (currentUser == "") {
    //User is logged-out so forbidden page
    res.render('pages/main', { //So, taking them back to the main page
      user: currentUser
    });
  } else { //User is logged-in so we can display the profile page

    //Getting the user's profile from the database
    db.collection('profiles').findOne({"login.username": currentUser}, function(err, result) {
      if (err) throw err; //if there is an error, throw the error

      //Displaying the profile page
      res.render('pages/profile', {
        //Feeding the database content to the screen
        First: result.fname,
        Last: result.surname,
        Username: result.login.username
      });
    });
  }
});

//Displays the journey page
app.get('/journey', function(req, res) {
  //Checking if the user is logged-in
  if (currentUser == "") { //User is logged-out
    res.render('pages/main', { //So, redirecting them to main page
      user: currentUser
    });
  } else { //User is logged-in

    //Getting the user's journeys from the database
    db.collection('profiles').findOne({"login.username": currentUser}, function(err, result) {
      if (err) throw err; //if there is an error, throw the error;

      //Display the journeys on the screen
      try{ //The user has saved journeys, display the first
      res.render('pages/journey', {
        //Displaying the database content on the screen
        start: result.journeys[0].start,
        end: result.journeys[0].end,
        reg: result.journeys[0].reg,
        fuel: result.journeys[0].fcost,
        mpg: result.journeys[0].mpg,
        pass: result.journeys[0].pass,
        prof: result.journeys[0].profit,
        rec: result.journeys[0].rec,
        name: result.journeys[0].name,
        options: result.journeys
      });
    }catch(err){ //User has no journeys saved
      res.render('pages/journey', {
        //Displaying the database content on the screen
        start: "No journey",
        end: "No journey",
        reg: "No journey",
        fuel: "No journey",
        mpg: "No journey",
        pass: "No journey",
        prof: "No journey",
        rec: "No journey",
        name: "No journey",
        options: [0]
      });
    }
    });
  }
});

//Displays the new car page
app.get('/newcar', function(req, res) {
  //Checking if the user is logged-in
  if (currentUser == "") { //User is logged-out
    res.render('pages/main', { //So, redirect to the main page
      user: currentUser
    });
  } else { //User is logged-in
    //Display the new car page
    res.render('pages/newcar');
  }
});

//Displays the garage page
app.get('/garage', function(req, res) {
  //Checks if the user is logged-in
  if (currentUser == "") { //User is logged-out
    res.render('pages/main', { //So, redirect to the main page
      user: currentUser
    });
  } else { //User is logged-in

    //Getting the user's cars from the database
    db.collection('profiles').findOne({"login.username": currentUser}, function(err, result) {
      if (err) throw err; //if there is an error, throw the error;

      //Displaying the cars on the screen
      try{ //User has saved cars, display the first
      res.render('pages/garage', {
        make: result.car[0].make,
        model: result.car[0].model,
        reg: result.car[0].reg,
        ftype: result.car[0].ftype,
        mpg: result.car[0].mpg,
        options: result.car
      });
    }catch(err){ //User has no cars saved, display this
      res.render('pages/garage', {
        make: "No car",
        model: "No car",
        reg: "No car",
        ftype: "No car",
        mpg: "No car",
        options: [0]
      });
    }
    });
  }
});

//Updates the garage page with the selected car data
app.post('/refresh', function(req, res) {
  //Check if the user is logged-in so they don't access this page early
  if (currentUser == "") { //User is logged-out
    res.render('pages/main', { //Redirect to the main page
      user: currentUser
    });
  } else { //User is logged-in

    //Get the car data from the database
    db.collection('profiles').findOne({"login.username": currentUser}, {
      car: {
        $elemMatch: {
          reg: req.body.newreg
        }
      }
    }, function(err, result) {
      if (err) throw err; //if there is an error, throw the error

      //Display the database results on the screen
      try{ //Car with this reg exists, display it
      var data = {
        make: result.car[0].make,
        model: result.car[0].model,
        reg: result.car[0].reg,
        ftype: result.car[0].ftype,
        mpg: result.car[0].mpg,
        options: result.car
      };
    }catch(err){//Car with this reg does not exist, display this
      var data ={
      make: "No car",
      model: "No car",
      reg: "No car",
      ftype: "No car",
      mpg: "No car",
      options: [""]
    };
    }
      res.send(data); //Sending the data back to the screen
    });
  }
});

//Updates the journey page
app.post('/refreshJourney', function(req, res) {
  //Checking if the user is logged-in
  if (currentUser == "") { //User not logged-in
    res.render('pages/main', { //So redirecting to the main page
      user: currentUser
    });
  } else { //User is logged-in
    db.collection('profiles').findOne({ "login.username": currentUser}, { //Getting the user's journeys from the database
      //Displaying journeys on screen
      journeys: {
        $elemMatch: {
          name: req.body.name
        }
      }
    }, function(err, result) {
      if (err) throw err; //if there is an error, throw the error
      try{ //The user has journeys saved
      var data = {
        start: result.journeys[0].start,
        end: result.journeys[0].end,
        pass: result.journeys[0].pass,
        reg: result.journeys[0].reg,
        fcost: result.journeys[0].fcost,
        mpg: result.journeys[0].mpg,
        rec: result.journeys[0].rec,
        profit: result.journeys[0].profit,
        name: result.journeys[0].name
      };
    }catch(err){ //The user has no journeys saved
      var data = {
        start: "No journey",
        end: "No journey",
        pass: "No journey",
        reg: "No journey",
        fcost: "No journey",
        mpg: "No journey",
        rec: "No journey",
        profit: "No journey",
        name: "No journey"
      };
    }
      //Send the data back to the client
      res.send(data);
    });
  }
});

//Registers a user
app.post('/adduser', function(req, res) {
  //First, check that the username isn't taken
  db.collection('profiles').findOne({"login.username": req.body.username},
  function(err, user) {
    if (err) {console.log(err);} //If theres an error, log it

    //Declaring  and initialising our message variable that will be sent to the client
    var message ="";
    if (user) { //A profile with this username exists
      message = "user exists"; //This will be sent back to the client to inform the user of the error

      //Redirecting the user back to the register page with the error message
      res.render('pages/register', {
        msg: "Username Taken"
      });
    } else { // The username is not exist
      message = "user doesn't exist"; //This will be sent back to the user to inform the user that their username is valid

      //Inputting the data into the object that will be saved in our database
      var datatostore = {
        "fname": req.body.fname,
        "surname": req.body.surname,
        "login": {
          "username": req.body.username,
          "pword": req.body.password
        },
        "car": [{
          "make": req.body.make,
          "model": req.body.model,
          "year": req.body.year,
          "reg": req.body.reg,
          "ftype": req.body.ftype,
          "mpg": req.body.mpg
        }]
      }

      //Saving our object to the database
      db.collection('profiles').save(datatostore, function(err, result) {
        if (err) throw err; //Display and error if there is an error with saving the profile
        currentUser = datatostore.login.username; //Current user is updated
        res.redirect('/main')  //When complete redirect to the main page
      })
    }
  });
});

//Saves a car to the garage
app.post('/addcar', function(req, res) {
  //Checking if the user is logged-in
  if (currentUser == "") { //User is logged-out
    res.render('pages/main', { //Redirect to the main page as the 'New Car' page is forbidden
      user: currentUser
    });
  } else { //User is logged-in, so access to this route is allowed
    //Setting up or update parameters
    var query = {"login.username": currentUser}; //The profile to be updated
    var newvalues = { //The car to be added
      $addToSet: {
        car: {
          make: req.body.make,
          model: req.body.model,
          year: req.body.year,
          reg: req.body.reg,
          ftype: req.body.ftype,
          mpg: req.body.mpg
        }
      }
    };

    //Run the update
    db.collection('profiles').update(query, newvalues, function(err, result) {
      if (err) throw err; //If there is an error with updating, display it
      res.redirect('/garage'); //Once complete redirect back to the garage
    });
  }
});

//Saving a journey
app.post('/addjourney', function(req, res) {
  //Checking that the user is logged in
  if (currentUser == "") { //User is logged-out, so this route is forbidden
    res.render('pages/main', { //Redirecting back to main
      user: currentUser
    });
  } else { //User is logged-in so permission to this route is granted
    //Setting up our update parameters
    var query = {"login.username": currentUser}; //The profile to be updated
    var newvalues = { //The journey to be added
      $addToSet: {
        journeys: {
          start: req.body.Start,
          end: req.body.End,
          pass: req.body.pass,
          reg: req.body.reg,
          fcost: req.body.fcost,
          mpg: req.body.mpg,
          rec: req.body.rec,
          profit: req.body.prof,
          name: req.body.jnyName
        }
      }
    };

    //Running our update
    db.collection('profiles').update(query, newvalues, function(err, result) {
      if (err) throw err; //If there is an error with the update, display it
      res.redirect('/main'); //Redirect to the main page once complete
    });
  }
});

//Checks if the user is logged in
app.get('/userLoggedIn', function(req, res) {
  res.send(currentUser); //Sends the current user to the client
})

//Removes a car from the database
app.post('/remcar', function(req, res) {
  //Checks if the user is logged-in
  if (currentUser == "") { //User is logged-out so this page is forbidden to them
    res.render('pages/main', { //Redirecting them to the main page
      user: currentUser
    });
  } else { //User is logged-in
    //Setting our update parameters
    var query = {"login.username": currentUser}; //The profile to be updated
    var newvalues = { //The car to be removed
      $pull: {
        car: {
          reg: req.body.reg
        }
      }
    };

    //Running our update
    db.collection('profiles').update(query, newvalues, function(err, result) {
      if (err) throw err; //If there is an error with the update, display it
    });

    //Refresh the screen with the updated profile
    db.collection('profiles').findOne({"login.username": currentUser}, //Gets the users profile
    function(err, result) {
      if (err) throw err; //if there is an error, throw the error
      try{ //The user has cars saved, display the first
      var data = {
        make: result.car[0].make,
        model: result.car[0].model,
        reg: result.car[0].reg,
        ftype: result.car[0].ftype,
        mpg: result.car[0].mpg,
        options: result.car
      };
    }catch(err){ //The user has no cars saved, display this
      var data = {
        make: "No car",
        model: "No car",
        reg: "No car",
        ftype: "No car",
        mpg: "No car",
        options: [0]
      };
    }
      res.send(data); //Sending our data back to the client to be displayed to the user
    });
  }
});

//Edits the profile
app.post('/editprofile', function(req, res) {
  //Checks if the user is logged-in
  if (currentUser == "") { //User is logged-out, so this page is forbideen
    res.render('pages/main', { //So, redirect to the main page
      user: currentUser
    });
  } else { //User is logged-in so access to this route is granted
    db.collection('profiles').findOne({"login.username": req.body.username}, //Getting the profile to be updated
    function(err, profile) {
      if (err) throw err; //if there is an error, throw the error

      //Checking that the username doesn't exist, if changed
      if (profile && req.body.username != profile.login.username) { //The username is invalid
        var data = { msg: "Username Taken"}; // The error message to be sent back to the user
        res.send(data); //Sending the message to the client
      } else {//The username is valid
        //Setting our update parameters
        var query = {"login.username": currentUser  }; //The profile to be updated
        var newvalues = { //The new profile information
          $set: {
            login: {
              username: req.body.username,
              pword: req.body.pword
            },
            fname: req.body.fname,
            surname: req.body.surname
          }
        };

        //Changing the logged-in user
        currentUser = req.body.username;

        //Running our update
        db.collection('profiles').update(query, newvalues, function(err, result) {
          if (err) throw err; //If there is an error updating, then dislay it
        });

        //Refreshing the screen with the new profile
        db.collection('profiles').findOne({"login.username": currentUser}, function(err, profile) {
          if (err) throw err; //if there is an error, throw the error
          var data = { //The data to be sent and displayed
            fname: profile.fname,
            surname: profile.surname,
            username: profile.login.username,
            msg: ""
          };
          res.send(data); //Sending the data back to the client
        });
      }
    });
  }
});

//Removing a journey
app.post('/remjourney', function(req, res) {
  //Checking that the user is logged-in
  if (currentUser == "") { //User is logged-out, so this page is forbidden to them
    res.render('pages/main', { //So, redirecting to the main page
      user: currentUser
    });
  } else { //User is logged-in so access to this route is granted
    //Setting our update parameters
    var query = {"login.username": currentUser}; //The profile to be updated
    var newvalues = { //The journey to be removed
      $pull: {
        journeys: {
          name: req.body.name
        }
      }
    };

    //Running our update
    db.collection('profiles').update(query, newvalues, function(err, result) {
      if (err) throw err; //If there is an error updating then display this
    });

    //Refreshing our journey screen
    db.collection('profiles').findOne({"login.username": currentUser}, // Gets the user's profile
    function(err, result) {
      if (err) throw err; //if there is an error, throw the error
      try{ //User has journeys saved
      var data = { //Display the journeys
        start: result.journeys[0].start,
        end: result.journeys[0].end,
        pass: result.journeys[0].pass,
        reg: result.journeys[0].reg,
        fcost: result.journeys[0].fcost,
        mpg: result.journeys[0].mpg,
        rec: result.journeys[0].rec,
        profit: result.journeys[0].profit,
        name: result.journeys[0].name,
        options: result.journeys
      };
    }catch(err){ //User has no journeys saved
      var data = { //Display that they have no journeys saved
        start: "No journey",
        end: "No journey",
        pass: "No journey",
        reg: "No journey",
        fcost: "No journey",
        mpg: "No journey",
        rec: "No journey",
        profit: "No journey",
        name: "No journey",
        options: [0]
      };
    }
      res.send(data); //Sending this data back to the client
    });
  }
});

//Logs the user in
app.post('/dologin', function(req, res) {
  //Getting our username and password from the client
  var uname = req.body.uname;
  var pword = req.body.pword;

  //Gets our profile for the given username
  db.collection('profiles').findOne({"login.username": uname},
  function(err, result) {
    //Check if the user exists
    if (result == null) { //No profile with that username exists
      //Re-direct back to the same page
      backURL = req.header('Referer');
      var x = backURL + "#loginError";
      res.redirect(x);

      //Cancel log-in
      return;
    }
    if (err) {
      console.log(err);
      res.redirect('back')
    } //if there is an error, throw the error

    //Check the given password against the saved one for that user
    if (result.login.pword == pword) { //Passwords match
      //Sets the user status to logged-in
      req.session.loggedin = true;
      currentUser = result.login.username;

      //Take them to the profile page
      res.redirect('/profile')
    }
    //if there is no result, redirect the user back to the login system as that username must not exist
    else {
      backURL = req.header('Referer');
      var x = backURL + "#loginError";
      res.redirect(x);
    }
  });
});

//Logging the user out
app.get('/logout', function(req, res) {
  //Checks if the user is logged-in
  if (currentUser == "") { //User is logged-out already so this page is forbidden
    res.render('pages/main', { //Redirect back to the main page
      user: currentUser
    });
  } else { //User is logged-in, so log them out
    //Logging the user out
    req.session.loggedin = false;
    req.session.destroy();
    currentUser = "";

    //Taking them back to the main page
    res.redirect('/main');
  }
});

//Handles 404 page not found error
app.use(function(req, res, next) {
  res.status(404).render('pages/404'); //Display the custom 404 page
})

import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import  regNumApp from './reg_numbers.js';
import registationDB from './reg_numbersdb.js';
import flash from 'express-flash';
import session from 'express-session';


const pgp = pgPromise();


const registrationAppInstance =  regNumApp();
const connectionString = process.env.DATABASE_URL || 'postgres://otsqntws:PMjDMvfDxKFBm-fOWGQNRC3CPqlIMiHa@dumbo.db.elephantsql.com/otsqntws?ssl=true';   
const db = pgp(connectionString);
const registrationDB = registationDB(db);


const app = express();
 app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(flash());


const handlebars = exphbs.create({
  extname: '.handlebars',
  defaultLayout: false,
  layoutDir: './views/layouts',
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('views', './views');

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


const regNum = regNumApp();
const registrationNumbers = [];


// home route
app.get('/', async (req, res) => {
  // Retrieve registration number from the request
  const registration = req.body.registrationNumber;
  
  // Get town names based on the registration number
  const townNames = registrationAppInstance.townID(registration);
  
  // Get error message based on registration and town names
  const errorMessage = registrationAppInstance.errorMsg(registration, townNames);
  
  // Fetch a list of all towns from the database
  let displayTowns = await registrationDB.getAllTowns();
  
  // Render the 'index' view with data
  res.render('index', { displayTowns, errorMessage });
});

// Route to handle adding a registration number
app.post('/reg_numbers', async (req, res) => {
  // Retrieve registration number from the request
  let registration = req.body.registrationNumber;
  
  // Flash an error message
 // req.flash('error', 'Enter a correct registration format');

  // Render the 'index' view
  res.render('index');
});

//Route to handle adding a registration number to the database
// app.post('/add', async (req, res) => {
//   // Retrieve and clean the registration number from the request
//   const registration = (req.body.registrationNumber).toUpperCase().trim();
  
//   // error message to enter the registartion number
//   if (await registrationDB.getAllTowns()) {
//     req.flash('error', 'please enter your registration number');
//   } else if (registrationAppInstance.errorMsg(registrationNumbers)) {
//     // Add the registration number to the database
//     await regNum.addRegistration(registrationNumbers);
//   }
  
//   // Get town names based on the registration number
//   const townNames = registrationAppInstance.townID(registration);
  
//   // Get the town IDs from the database
//   const townIDs = await registrationDB.getTownId(townNames);
  
//   if (townIDs && townNames) {
//     // Extract the town ID
//     const townid = townIDs.id;
    
//     // Insert the registration number into the database
//     const insertTowns = await registrationDB.insertRegistrationNumber(registration, townid);
//   } else {
//     registrationAppInstance.errorMsg(registration, townNames);
//   }


//   // Redirect back to the root URL
//   res.redirect('/');
// });
// Route to handle adding a registration number to the database
app.post('/add', async (req, res) => {
  // Retrieve and clean the registration number from the request
  const registration = (req.body.registrationNumber).toUpperCase().trim();
  
  // Check if the registration number already exists in the database
  const registrationExists = await registrationDB.doesRegNumExist(registration);

  if (registrationExists) {
    req.flash('error', 'This registration number already exists');
  } else if (!registrationAppInstance.registationsFormat(registration)) {
    req.flash('error', 'Please enter a valid registration number');
  } else {
    // Add the registration number to the database
    await regNum.addRegistration(registration);

    // Get town names based on the registration number
    const townNames = registrationAppInstance.townID(registration);
    
    // Get the town IDs from the database
    const townIDs = await registrationDB.getTownId(townNames);
    
    if (townIDs && townNames) {
      // Extract the town ID
      const townid = townIDs.id;
      
      // Insert the registration number into the database
      await registrationDB.insertRegistrationNumber(registration, townid);
    } else {
      registrationAppInstance.errorMsg(registration, townNames);
    }
  }

  // Redirect back to the root URL
  res.redirect('/');
});




// Route to handle displaying the 'add' page
app.get('/add', async (req, res) => {
  // Retrieve registration number from the request
  const registration = req.body.registrationNumber;
  
  // Add the registration number and get a message
  const message = registrationAppInstance.addRegistration(registration);
  
  // Render the 'index' view with the message
  res.render('index', { message });
});

// Route to set the selected town
app.post('/setTown', async (req, res) => {
  // Retrieve the selected town from the request
  const town = req.body.regTown;
  
  // Get registration numbers by the selected town
  const displayTowns = await registrationDB.getRegByTown(town);
  
  // Render the 'index' view with the filtered registration numbers
  res.render('index', { displayTowns });
});

// Route to reset the database and application state
app.post('/reset', async (req, res) => {
  // Refresh the database
  await registrationDB.refreshDatabase();
  
  // Reset the application state
  registrationAppInstance.reset();
  
  // Redirect back to the root URL
  res.redirect('/');
});

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



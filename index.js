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


  // Render the 'index' view
  res.render('index');
});


// Route to handle adding a registration number to the database
app.post('/add', async (req, res) => {
  // Retrieve and clean the registration number from the request
  const registration = (req.body.registrationNumber || '').toUpperCase().trim();

  // Define the exact required length for registrations
  const requiredRegistrationLength = 10;

  // Regular expression to check if the registration starts with CA, CW, or CJ
  const validPrefixRegex = /^(CA|CW|CJ)\s+/;

  // Check if the registration number is empty
  if (!registration) {
    req.flash('error', 'Please enter your registration number');
  } else if (registration.length !== requiredRegistrationLength) {
    req.flash('error', 'Registration number must have exactly ' + requiredRegistrationLength + ' characters.');
  } else if (!validPrefixRegex.test(registration)) {
    req.flash('error', 'Please enter a registration number that starts with CA, CW, or CJ.');
  } else {
    // Continue with other validations and database operations

    // Check if the registration number already exists in the database
    const registrationExists = await registrationDB.doesRegNumExist(registration);

    if (registrationExists) {
      req.flash('error', 'This registration number already exists');
    } else {
      // Get town names based on the registration number
      const townNames = registrationAppInstance.townID(registration);

      // Get the town IDs from the database based on townNames
      const townIDs = await registrationDB.getTownId(townNames);

      if (townIDs && townNames) {
        // Extract the town ID
        const townid = townIDs.id;

        // Insert the registration number into the database
        const insertTowns = await registrationDB.insertRegistrationNumber(registration, townid);

        // Set a success message
        req.flash('success', 'The registration number ' + registration + ' has been added successfully.');
      } else {
        registrationAppInstance.errorMsg(registration, townNames);
      }
    }
  }

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


   // Check if there are no registrations
   const noRegistrations = displayTowns.length === 0;
  
  // Render the 'index' view with the filtered registration numbers
  res.render('index', { displayTowns, noRegistrations});
});

app.get('/show', async (req, res) => {
  try {
    // Check if the database has been cleared
    const databaseCleared = req.session.databaseCleared;
    req.session.databaseCleared = false; // Reset the flag

    // Retrieve registration numbers by the selected town
    const displayTowns = await registrationDB.getRegByTown(town);

    // Check if there are no registrations and the database has been cleared
    const noRegistrations = displayTowns.length === 0;
    const message = noRegistrations && databaseCleared ? 'No registration numbers found, the database has been cleared.' : '';

    // Render the 'index' view with the filtered registration numbers or message
    res.render('index', { displayTowns, noRegistrations, message });
  } catch (error) {
    // Handle errors here, e.g., log the error and send an error response
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/showAll', async (req, res) => {
  try {
    // Check if the database has been cleared
    const databaseCleared = req.session.databaseCleared;
    req.session.databaseCleared = false; // Reset the flag
    //const noRegistrations = displayTowns.length === 0;
    // Retrieve all registration numbers from your data source
    const allRegistrationNumbers = await registrationDB.getAllRegistrationNumbers();

    // Check if there are no registrations and the database has been cleared
    const message = allRegistrationNumbers.length === 0 && databaseCleared ? 'No registration numbers found, the database has been cleared.' : '';

    // Render the page with all registration numbers or message
    res.render('index', {
      displayTowns: allRegistrationNumbers,
      noRegistrations: allRegistrationNumbers.length === 0,
      message,
    });
  } catch (error) {
    // Handle errors here, e.g., log the error and send an error response
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/reset', async (req, res) => {
  try {
    // Clear the database data
    await registrationDB.refreshDatabase();
    req.session.databaseCleared = true; // Set the flag to true
    req.flash('success', 'The database has been cleared successfully.');
  } catch (error) {
    req.flash('error', 'Failed to clear the database: ' + error.message);
  }

  res.redirect('/');
});

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



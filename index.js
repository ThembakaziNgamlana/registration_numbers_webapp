// import express from 'express';
// import exphbs from 'express-handlebars';
// import bodyParser from 'body-parser';
// import pgPromise from 'pg-promise';
// import registationDB from './reg_numberdb.js';

// const pgp = pgPromise();

// const connectionString = 'postgres://ejzxpebx:JWUrQffnT4IvDhiOQuUT-r6ihCrdaoBF@snuffleupagus.db.elephantsql.com/ejzxpebx';

// const db = pgp(connectionString);




// const handlebars = exphbs.create({
//   extname: '.handlebars',
//   defaultLayout: false,
//   layoutDir: './views/layouts',
// });

// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');
// app.set('views', './views');

// app.use(express.static('public'));


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// const registrationDB = registationDB(pgp);

// const registrationNumbers = [];


// app.get('/', async (req, res) => {
  
//   const towns = await registrationDB.getAllTowns();

//   res.render('index', { towns });
// });

// app.post('/add', async (req, res) => {
//   const { registrationNumber, regTown } = req.body;
//   if (registrationNumber.trim() !== '') {
  
//     await registrationDB.insertRegistrationNumber(registrationNumber, regTown);
//   }
//   res.redirect('/');
// });


// app.post('/reg_numbers', async (req, res) => {
//   const selectedTown = req.body.selectedTown;


//   const filteredNumbers = await registrationDB.getAllTowns(selectedTown);


//   res.render('index', { registrationNumbers: filteredNumbers, selectedTown });
// });


// app.listen(3001, () => {
//   console.log('Server is running on http://localhost:3001');
// });

// import express from 'express';
// import exphbs from 'express-handlebars';
// import bodyParser from 'body-parser';

// const app = express();

// const handlebars = exphbs.create({
//   extname: '.handlebars',
//   defaultLayout: false,
//   layoutDir: './views/layouts',
// });

// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');
// app.set('views', './views');

// app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const registrationNumbers = [];

// app.get('/', async (req, res) => {
//   // Replace this with your desired logic to fetch towns from a database or other source
//   const towns = ['Krugersdorp', 'Midrand', 'Centurion', 'Springs'];

//   res.render('index', { towns });
// });

// app.post('/reg_numbers', async (req, res) => {
//   const { registrationNumber, regTown } = req.body;
//   if (registrationNumber.trim() !== '') {
//     registrationNumbers.push({ number: registrationNumber, town: regTown });
//   }
//   res.redirect('/');
// });

// app.post('/reg_numbers', async (req, res) => {
//   const selectedTown = req.body.selectedTown;
//   const filteredNumbers = registrationNumbers.filter(item => item.town === selectedTown);
//   res.render('index', { registrationNumbers: filteredNumbers, selectedTown });
// });

// app.listen(3001, () => {
//   console.log('Server is running on http://localhost:3001');
// });
// app.js
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import  regNumApp from './reg_numbers.js';
import registationDB from './reg_numbersdb.js';

const pgp = pgPromise();


const registrationAppInstance =  regNumApp();
const connectionString = 'postgres://ejzxpebx:JWUrQffnT4IvDhiOQuUT-r6ihCrdaoBF@snuffleupagus.db.elephantsql.com/ejzxpebx';

const db = pgp(connectionString);

const app = express();


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


const registrationDB = registationDB(pgp);

const registrationNumbers = [];

app.get('/', (req, res) => {
  res.render('', { townList: registrationAppInstance.getRegistrationsForTown() });
});
app.post('/add', (req, res) => {
  const registration = req.body.registrationNumber;
  registrationAppInstance.addRegistration(registration);
  res.redirect('/');
});
// Add registration route
app.post('/reg_numbers', (req, res) => {
  const registration = req.body.registrationNumber;
  registrationAppInstance.addRegistration(registration);
  res.redirect('/');
});

// Set selected town route
app.post('/setTown', (req, res) => {
  const town = req.body.regTown;
  registrationAppInstance.setSelectedTown(town);
  res.redirect('/');
});

// Reset route
app.post('/reset', (req, res) => {
  registrationAppInstance.reset();
  res.redirect('/');
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
 });

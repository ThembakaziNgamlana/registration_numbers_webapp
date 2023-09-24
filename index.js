import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import  regNumApp from './reg_numbers.js';
import registationDB from './reg_numbersdb.js';

const pgp = pgPromise();


const registrationAppInstance =  regNumApp();
const connectionString = process.env.DATABASE_URL || 'postgres://otsqntws:PMjDMvfDxKFBm-fOWGQNRC3CPqlIMiHa@dumbo.db.elephantsql.com/otsqntws?ssl=true';   
const db = pgp(connectionString);
const registrationDB = registationDB(db);


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

const PORT = process.env.PORT || 3000;


const regNum = regNumApp();
const registrationNumbers = [];



app.get('/',async (req, res) => {

  let displayTowns = await registrationDB.getAllTowns()
 console.log(displayTowns)
  res.render('index',
 {displayTowns})
   //{ message: registrationAppInstance.getRegistrationsNumbers() });
});


// Add registration route
app.post('/reg_numbers', async(req, res) => {
 let  registration = req.body.registrationNumber;
  //registration = registrationAppInstance.getRegistrationNumbers(registration);
 const validationMessage = registrationAppInstance.getValidationMessage()
 

  res.render('index', {
    validationMessage,
  // registration,
    //townList: registrationAppInstance.getRegistrationsForTown(),
  });
});
 app.post('/add', async(req, res) => {
  const registration = req.body.registrationNumber;
 const townNames = registrationAppInstance.townID(registration)
 const townIDs = await registrationDB.getTownId(townNames)
//const townNames = req.body.town;
  const townid = townIDs.id
  console.log(townIDs)

 //console.log(townIDs)
 // console.log(townidsql)
  const insertTowns = await registrationDB.insertRegistrationNumber(registration, townid)


//console.log(insertTowns)
  // if (registration === ''){
  //    req.flash('errorMessage','this is a empty string')

  // }else{
  //    insertTowns
  // }
  //   insertTowns
     res.redirect('/');

   
});

app.get('/add', async (req, res) => {
 const registration = req.body.registrationNumber;
   //registrationAppInstance.isValidRegistration(registration);
  const message = registrationAppInstance.addRegistration(registration);
 // const registrations = await registrationDB.getAllTowns();

  console.log(message)

  res.render('index', {
    message,
    //registrations,
  });
});

//Set selected town route
app.post('/setTown', async (req, res) => {
  const town = req.body.regTown;
  console.log(town)
  // const prefix = req.body.regPrefix;
  // registrationAppInstance.setSelectedTown(town);
 const displayTowns = await registrationDB.getRegByTown(town)
 console.log(displayTowns)
  res.render('index', {
    displayTowns,
    
  });

});

// Reset route
app.post('/reset', async(req, res) => {
  await registrationDB.refreshDatabase();
  registrationAppInstance.reset()
  res.redirect('/');
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
 });

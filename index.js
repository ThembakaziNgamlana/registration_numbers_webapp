import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import regNumApp from './reg_numbers.js'; 
import pgPromise from 'pg-promise';
import registationDB from './reg_numberdb.js';

const pgp = pgPromise();

const handlebars = exphbs.create({
  extname: '.handlebars',
  defaultLayout: false,
  layoutDir: './views/layouts',
});

const app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = registationDB(pgp);

const regNumInstance = regNumApp(db);

app.get('/', (req, res) => {
  res.render('index', {});
});


app.post('/add', (req, res) => {
  const { registrationNumber, regTown } = req.body;
  if (registrationNumber.trim() !== '') {
    registrationNumbers.push({ number: registrationNumber, town: regTown });
  }
  res.redirect('/');
});


app.post('/filter', (req, res) => {
  const selectedTown = req.body.selectedTown;
  const filteredNumbers = registrationNumbers.filter(item => item.town === selectedTown);
  res.render('index', { registrationNumbers: filteredNumbers, selectedTown });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

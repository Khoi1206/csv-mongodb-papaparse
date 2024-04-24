const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars'); // template
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

// express app
const app = express();
const route = require('./routes');
const db = require('./config/db');

// Connect DB
dotenv.config();
const port = process.env.PORT || 5000;
db.connect();

// middleware & static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.urlencoded({
    extended: true,
  }),
  bodyParser.urlencoded({
    extended: false,
  }),
  express.json(),
  bodyParser.json(),
  fileUpload()
);

//template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      pageNumber: (currentPage, index) => {
        return (currentPage - 1) * 10 + index + 1;
      },
    },
  })
);

// Views
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Route init
route(app);

// Config
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

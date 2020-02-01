const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config');

const app = express();

mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors()); // receive any error from front end

const userRouter = require('./routes/account');
const mainRouter = require('./routes/main');
const sellerRouter = require('./routes/seller');

app.use('/api', mainRouter);
app.use('/api/accounts', userRouter);
app.use('/api/seller', sellerRouter);


app.listen(config.port, (err) => {
    console.log(`Successfully Connected on port: ${config.port} `);
});
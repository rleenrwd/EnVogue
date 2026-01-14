if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log('CORS_ORIGIN: ', process.env.CORS_ORIGIN);

if (!process.env.CORS_ORIGIN) {
    console.error('CORS_ORIGIN is not set. Check .env file.');
    process.exit(1);
}

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const connectDb = require('./database/db');

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
}

connectDb();

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log('App now listening on port:', PORT)
})
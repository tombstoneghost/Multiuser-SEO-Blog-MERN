const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//bring routes
const blogRoutes = require('./routes/blog');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log(err);
})

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());


//cors
if(process.env.NODE_ENV === 'developer') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}));
}

//routes middleware
app.use('/api',blogRoutes);

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
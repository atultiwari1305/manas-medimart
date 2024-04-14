const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const route = require('./routes/routes');

require("./db/connect")
const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth",route);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the dist/browser folder and dist/server folder
app.use(express.static(path.join(__dirname, "../../frontend/dist/frontend/browser")));
app.use(express.static(path.join(__dirname, "../../frontend/dist/frontend/server")));

app.get('/api/message', (req, res) => { 
    res.json({ message:  'API route connected' }); 
}); 

// Route for serving the browser index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/browser/index.html'));
});

// Catch-all route to serve browser index.html if no other route matches
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/browser/index.html'));
});

app.listen(3000, ()=>{
    console.log(`Server started at port number 3000`);
})
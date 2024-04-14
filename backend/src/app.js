const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

require("./db/connect")
const app = express();

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the dist/browser folder
app.use(express.static(path.join(__dirname, "../../frontend/dist/frontend/browser")));

// Serve static files from the dist/server folder
app.use(express.static(path.join(__dirname, "../../frontend/dist/frontend/server")));

app.get('/api/message', (req, res) => { 
    res.json({ message:  'API route connected' }); 
}); 

// Route for serving the browser index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/browser/index.html'));
});

// // Route for serving the server index.html file
// app.get('/server', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/server/index.server.html'));
// });

// Catch-all route to serve browser index.html if no other route matches
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/browser/index.html'));
});

app.listen(3000, ()=>{
    console.log(`Server started at port number 3000`);
})
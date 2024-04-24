const express = require('express');
const cors = require('cors');
const route = require('./routes/routes');

require("./db/connect")
const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use("/auth", route);

app.listen(3000, () => {
    console.log(`Server started at port number 3000`);
});

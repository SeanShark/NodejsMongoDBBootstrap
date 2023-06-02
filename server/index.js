require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//Middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
const API = require("./routes/api/posts");
const Users = require("./routes/api/user");

app.use('/api/posts', API);
app.use('/api/user', Users);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started on port ${port}...`));
 
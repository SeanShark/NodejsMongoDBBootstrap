require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  exposedHeaders: "Captcha"
};

//Middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Routes
const API = require("./routes/api/posts");
const Users = require("./routes/api/user");
const TodoLists = require("./routes/api/todo");

app.use('/api/posts', API);
app.use('/api/user', Users);
app.use('/api/todo', TodoLists);

const port = process.env.PORT;
const time = new Date();

app.listen(port, () => console.log(`Server started on port ${port}...Launch time: ${ time }`));
 
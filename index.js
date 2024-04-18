const dotenv = require("dotenv");
dotenv.config();

//Routes
const threadRoutes = require("./routes/ThreadRoute");

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT;

//Connect To the Database
db.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} `);
});

app.use("/thread", threadRoutes);

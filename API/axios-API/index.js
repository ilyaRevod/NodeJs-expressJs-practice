const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'morganLogs', 'access.log'), { flags: 'a' });
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));


app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency.json");
    const result = response.data;
    res.render('index.ejs', { data: result.cryptocurrency[0] });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.send("Error!");
  };
});


app.post("/", async (req, res) => {
  const response = await axios.get("http://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency.json");
  const result = response.data;
  const userReq = req.body.type;
  if (userReq === 'usd') {
    res.render('index.ejs', { data: result.currency[0] });
  } else if (userReq === 'euro') {
    res.render('index.ejs', { data: result.currency[1] });
  } else {
    res.send("Error!");
  };
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
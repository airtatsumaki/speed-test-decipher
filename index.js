const express = require('express');
// const FastSpeedtest = require("fast-speedtest-api");
const { UniversalSpeedtest, SpeedUnits } = require('universal-speedtest');
const universalSpeedtest = new UniversalSpeedtest({
  measureUpload: false,
  secure: true,
  downloadUnit: SpeedUnits.MBps
});
var bodyParser = require('body-parser')
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
var jsonParser = bodyParser.json();

// let speedtest = new FastSpeedtest({
//   token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
//   verbose: true, // default: false
//   timeout: 10000, // time taken to run speed test, default: 5000
//   https: true, // default: true
//   urlCount: 5, // default: 5
//   bufferSize: 8, // default: 8
//   unit: FastSpeedtest.UNITS.Mbps // default: Bps
// });

let speedTestValue = 0;
let record = 0;
let returnURL = ""; //respondent returnURL from decipher

app.route("/")
  .get((req, res) => {
    console.log(req.query);
    returnURL = req.query.returnUrl;
    record = req.query.record;
    res.render("pages/speedTestPage");
    // req.query = returns the url params.
    // set returnURL on entry
    // http://localhost:3000/?record=1&returnUrl=www.google.com
  })

app.route("/speedTestRun")
  .post(function (req, res) {
    universalSpeedtest.runCloudflareCom().then(function (result) {
      speedTestValue = result.downloadSpeed;
      console.log(`speed: ${speedTestValue}`);
      console.log(`record: ${record}`);
      console.log(`returnURL: ${returnURL}`);
      res.redirect(returnURL+`&result=${speedTestValue}`);
    });
  })

app.listen(3000, () => console.log("Server listening in port 3000"));
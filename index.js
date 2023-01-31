const express = require('express');
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

let speedTestValue = 0;
let record = 0;
let returnURL = ""; //respondent returnURL from decipher

app.route("/")
  .get((req, res) => {
    console.log(req.query);
    returnURL = req.query.returnUrl;
    record = req.query.record;
    res.render("pages/speedTestPage");
  })

app.route("/speedTestRun")
  .post(function (req, res) {
    universalSpeedtest.runCloudflareCom().then(function (result) {
      speedTestValue = result.downloadSpeed;
      console.log(`record: ${record}`);
      console.log(`returnURL: ${returnURL}`);
      console.log(`speed: ${speedTestValue}`);
      res.redirect(returnURL+`&result=${speedTestValue}`);
    });
  })

app.listen(3000, () => console.log("Server listening in port 3000"));
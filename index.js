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


const FastSpeedtest = require("fast-speedtest-api");
 
let speedtest = new FastSpeedtest({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
    verbose: false, // default: false
    timeout: 10000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps // default: Bps
});
 


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
    console.log(record);
    console.log(returnURL);
    // universalSpeedtest.runCloudflareCom().then(function (result) {
    // universalSpeedtest.runSpeedtestNet().then(function (result) {
    //   speedTestValue = result.downloadSpeed;
    //   console.log(`record: ${record}`);
    //   console.log(`returnURL: ${returnURL}`);
    //   console.log(`speed: ${speedTestValue}`);
    //   res.redirect(returnURL+`&result=${speedTestValue}`);
    // });
    speedtest.getSpeed().then(s => {
      console.log(`Speed: ${s} Mbps`);
      console.log(`record: ${record}`);
      console.log(`returnURL: ${returnURL}`);
      res.redirect(returnURL+`&result=${s}`);
    }).catch(e => {
      console.error(e.message);
    });
  })

  //http://localhost:3000/?record=1&returnUrl=https://www.google.com

app.listen(3000, () => console.log("Server listening in port 3000"));
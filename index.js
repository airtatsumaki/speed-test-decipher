const express = require('express');
// const FastSpeedtest = require("fast-speedtest-api");
const { UniversalSpeedtest, SpeedUnits } = require('universal-speedtest');
const universalSpeedtest = new UniversalSpeedtest({
  measureUpload: false,
  secure: false,
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
  .post((req, res) => {
    universalSpeedtest.runCloudflareCom().then((result) => {
      console.log(result);
      speedTestValue = result.downloadSpeed;
      console.log(`speed: ${speedTestValue}`);
      console.log(`record: ${record}`);
      console.log(`returnURL: ${returnURL}`);
      res.redirect("/complete");
    });
    
    // speedtest.getSpeed().then(s => {
    //   console.log(`Speed: ${s} Mbps`);
    //   speedTestValue = s;
    //   console.log(`speed :  ${speedTestValue}`);
    //   console.log(`record :  ${record}`);
    //   console.log(`returnURL :  ${returnURL}`);
    //   res.redirect("/complete");
    // }).catch(e => {
    //   console.error(e.message);
    // });
  })

app.route("/complete")
  .get((req, res) => {
  res.render("pages/complete", { speed: speedTestValue });
  //redirect to returnURL route
});

app.route("/exit")
  .post((req, res) => {
    res.redirect(returnURL+`&result=${speedTestValue}`);
  });

// app.route("/")
//   .get((req, res) => {
//     res.render("pages/index");
//   })
//   .post((req, res) => {
//     res.redirect("/speedTestPage");
//     speedtest.getSpeed().then(s => {
//       console.log(`Speed: ${s} Mbps`);
//       speedTestValue = s;
//       res.redirect("/complete");
//     }).catch(e => {
//       console.error(e.message);
//     });
//   });

// app.route("/speedTestPage")
//   .get((req, res) => {
//     // return res.render("pages/speedTestPage", {hideNext: true});
//     speedtest.getSpeed().then(s => {
//       console.log(`Speed: ${s} Mbps`);
//       speedTestValue = s;
//       return res.redirect("/complete");
//     }).catch(e => {
//       console.error(e.message);
//     });
//   })

// app.route("/complete")
//   .get((req, res) => {
//     res.render("pages/complete", {speed: speedTestValue});
//   });

app.listen(3000, () => console.log("Server listening in port 3000"));
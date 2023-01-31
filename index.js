const express = require('express');
const FastSpeedtest = require("fast-speedtest-api");
var bodyParser = require('body-parser')
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
var jsonParser = bodyParser.json();

let speedtest = new FastSpeedtest({
  token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
  verbose: true, // default: false
  timeout: 10000, // time taken to run speed test, default: 5000
  https: true, // default: true
  urlCount: 5, // default: 5
  bufferSize: 8, // default: 8
  unit: FastSpeedtest.UNITS.Mbps // default: Bps
});

let speedTestValue = 0;
let returnURL = ""; //respondent returnURL from decipher
let record = 0;

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
    speedtest.getSpeed().then(s => {
      console.log(`Speed: ${s} Mbps`);
      speedTestValue = s;
      res.redirect("/complete");
    }).catch(e => {
      console.error(e.message);
    });
  })

app.route("/complete")
  .get((req, res) => {
  res.render("pages/complete", { speed: speedTestValue });
  //redirect to returnURL route
});

app.route("/exit")
  .post((req, res) => {
    res.redirect(returnURL);
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

app.listen(8080, () => console.log("Server listening in port 3000"));
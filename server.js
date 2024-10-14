const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
const DILIMITER = ':';

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.get("/participants", (req, res) => {
  const users = [];
  let userStarting = false;

  const lineReader = require("readline").createInterface({
    input: fs.createReadStream("data.txt"),
  });
  let userCount = 0;

  lineReader.on("line", function (line) {
    if (userStarting) {
      const [key, value] = line.split(":");
      users[userCount][key] = value;
    }
    if (line[0] === "<") {
      userStarting = true;
      users.push({});
    }
    if (line[0] === ">") {
      userStarting = false;
      userCount++;
    }
  });

  lineReader.on("close", function () {
    res.send({ results: users });
  });
});

app.post("/participant", (req, res) => {
  console.log(req.body);
  
  const firstName = req.body?.firstName || "";
  const lastName = req.body?.lastName || "";
  const gitlab = req.body?.gitlab || "";
  const kaggle = req.body?.kaggle || "";
  const today = new Date();

  if(!sanitaze(firstName,lastName,gitlab,kaggle))
  {
    res.send({error:"Something went wrong"});
    return;
  }
  writeToFile(firstName,lastName,gitlab,kaggle,today);
  res.send({success:true});
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});







function writeToFile(firstName, lastName, gitlab, kaggle,today) {
  addLine("<");
  addLine(`firstName${DILIMITER}${firstName}`);
  addLine(`lastName${DILIMITER}${lastName}`);
  addLine(`gitlab${DILIMITER}${gitlab}`);
  addLine(`kaggle${DILIMITER}${kaggle}`);
  const date = `registrationDate${DILIMITER}${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`
  addLine(date);
  addLine(">");
}

function sanitaze(f, l, g, k) {
  if (f == "" || f.length > 100 || hasDilimiter(f)) return false;
  if (l == "" || l.length > 100 || hasDilimiter(l)) return false;
  if (g == "" || g.length > 200 || hasDilimiter(g)) return false;
  if (k == "" || k.length > 200 || hasDilimiter(k)) return false;
  return true;
}

function hasDilimiter(s) {
  return s.includes(DILIMITER);
}

function addLine(line) {
  // append data to file
  fs.appendFile(
    "data.txt",
    line + "\n",
    "utf8",
    // callback function
    function (err) {
      if (err) throw err;
    }
  );
}

